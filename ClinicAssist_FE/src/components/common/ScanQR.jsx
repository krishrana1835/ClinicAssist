import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const SCANNER_ID = "patient-qr-scanner";
const IMAGE_SCANNER_ID = "hidden-image-scanner";

const ScanQR = ({ onScanResult, className = "" }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  const processResult = async (decodedText) => {
    if (onScanResult) {
      onScanResult(decodedText);
    }

    if (showScanner) {
      await closeScanner();
    }
  };

  const scanImageFile = async (file) => {
    try {
      setCameraError("");

      const html5QrCode = new Html5Qrcode(IMAGE_SCANNER_ID);

      const decodedText = await html5QrCode.scanFile(
        file,
        true
      );

      await html5QrCode.clear();

      await processResult(decodedText);
    } catch (err) {
      console.error(err);
      setCameraError("No QR code found in the selected image.");
    }
  };

  const openScanner = () => {
    setShowScanner(true);
  };

  const closeScanner = async () => {
    try {
      if (qrRef.current) {
        const state = qrRef.current.getState?.();

        if (state === 2) {
          await qrRef.current.stop();
        }

        await qrRef.current.clear();
        qrRef.current = null;
      }
    } catch (err) {
      console.error("Failed to close scanner:", err);
    }

    setShowScanner(false);
    setIsLoading(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await scanImageFile(file);

    e.target.value = "";
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    await scanImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;

      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();

          if (file) {
            await scanImageFile(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    if (!showScanner) return;

    const startScanner = async () => {
      try {
        setIsLoading(true);
        setCameraError("");

        const html5QrCode = new Html5Qrcode(SCANNER_ID);

        qrRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          async (decodedText) => {
            await processResult(decodedText);
          },
          () => {
            // Ignore scan failures while searching
          }
        );

        setIsLoading(false);
      } catch (err) {
        console.error(err);

        setCameraError(
          "Unable to access camera. Please allow camera permissions and try again."
        );

        setIsLoading(false);
      }
    };

    startScanner();

    return () => {
      if (qrRef.current) {
        qrRef.current
          .stop()
          .then(() => qrRef.current?.clear())
          .catch(() => {});
      }
    };
  }, [showScanner]);

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-center items-center text-center relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent pointer-events-none"></div>

      {!showScanner ? (
        <>
          <span
            className="material-symbols-outlined text-primary text-[64px] mb-md"
            style={{ fontVariationSettings: '"wght" 300' }}
          >
            qr_code_scanner
          </span>

          <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
            Scan Patient QR Code
          </h3>

          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            Instantly access patient medical records, verify appointments,
            and update status.
          </p>

          <button
            onClick={openScanner}
            className="bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-sm px-xl rounded-full transition-colors active:scale-95 flex items-center gap-sm"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              camera_alt
            </span>
            Open Scanner
          </button>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-6 border-2 border-dashed border-outline-variant rounded-xl p-6 text-center"
          >
            <span className="material-symbols-outlined text-[40px] text-primary">
              upload_file
            </span>

            <p className="mt-2 font-body-md text-on-surface">
              Drag & Drop QR image here
            </p>

            <p className="text-sm text-on-surface-variant mt-1">
              Or paste an image using Ctrl + V
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 bg-secondary-container hover:opacity-90 px-4 py-2 rounded-full"
            >
              Upload QR Image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          {cameraError && (
            <div className="mt-4 text-error text-sm">
              {cameraError}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          {isLoading && (
            <div className="flex flex-col items-center mb-4">
              <span className="material-symbols-outlined animate-spin text-[40px]">
                cached
              </span>

              <p className="mt-2">Loading camera...</p>
            </div>
          )}

          {cameraError && (
            <div className="text-error mb-4">
              {cameraError}
            </div>
          )}

          <div
            id={SCANNER_ID}
            className="overflow-hidden rounded-xl border-2 border-primary"
          />

          <button
            onClick={closeScanner}
            className="mt-4 bg-error hover:opacity-90 text-on-error px-6 py-2 rounded-full"
          >
            Close Scanner
          </button>
        </div>
      )}

      {/* Hidden element required for scanFile() */}
      <div
        id={IMAGE_SCANNER_ID}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ScanQR;