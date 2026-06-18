import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region"; // Unique ID for the scanner container
 
const ScanQR = ({ onScanClick, className = '', onScanResult }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [isLoadingScanner, setIsLoadingScanner] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const scannerInstanceRef = useRef(null); // To hold the scanner instance
 
    const handleOpenScanner = () => {
        setShowScanner(true);
        // Optionally call the parent's onScanClick if it's meant to signify opening
        if (onScanClick) {
            onScanClick();
        }
    };
 
    const handleCloseScanner = () => {
        setShowScanner(false);
        setIsLoadingScanner(false); // Ensure loading is off
        setCameraError(null); // Clear errors on close
        if (scannerInstanceRef.current) {
            const clearPromise = scannerInstanceRef.current.clear();
            // Ensure clearPromise is actually a Promise before calling .catch
            if (clearPromise && typeof clearPromise.catch === 'function') {
                clearPromise.catch(error => {
                    console.error("Failed to clear html5QrcodeScanner", error);
                });
            }
            scannerInstanceRef.current = null;
        }
    };
 
    useEffect(() => {
        setIsLoadingScanner(true); // Start loading when scanner is about to show
        if (showScanner) {
            // Create a new scanner instance
            const html5QrcodeScanner = new Html5QrcodeScanner(
                qrcodeRegionId,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    disableFlip: false, // Set to true if you want to disable camera flip
                },
                /* verbose= */ false
            );
 
            const onScanSuccess = (decodedText, decodedResult) => {
                console.log(`QR Code scanned successfully: ${decodedText}`);
                setIsLoadingScanner(false); // Stop loading on success
                if (onScanResult) { // Pass the result to the parent component
                    onScanResult(decodedText);
                }
                alert(`Scanned: ${decodedText}`); // Simple alert for demonstration
                handleCloseScanner(); // Close scanner after successful scan
            };
 
            const onScanError = (errorMessage) => {
                console.warn(`QR Code scan error: ${errorMessage}`);
                setIsLoadingScanner(false); // Stop loading on error
                if (errorMessage.includes("NotAllowedError")) {
                    setCameraError("Camera access denied. Please grant camera permissions in your browser settings.");
                } else if (errorMessage.includes("NotFoundError")) {
                    setCameraError("No camera found. Please ensure a camera is connected and enabled.");
                } else {
                    setCameraError(`Failed to start camera: ${errorMessage}`);
                }
            };
 
            html5QrcodeScanner.render(onScanSuccess, onScanError)
                .catch(err => {
                    console.error("html5QrcodeScanner render failed:", err);
                    setIsLoadingScanner(false);
                    setCameraError(`Failed to initialize scanner: ${err.message}`);
                });
            scannerInstanceRef.current = html5QrcodeScanner; // Store the instance
 
            // Cleanup function
            return () => {
                if (scannerInstanceRef.current) {
                    const clearPromise = scannerInstanceRef.current.clear();
                    // Ensure clearPromise is actually a Promise before calling .catch
                    if (clearPromise && typeof clearPromise.catch === 'function') {
                        clearPromise.catch(error => {
                            console.error("Failed to clear html5QrcodeScanner on unmount", error);
                        });
                    }
                    scannerInstanceRef.current = null;
                }
            };
        } else {
            setIsLoadingScanner(false); // Ensure loading is off if scanner is not shown
        }
    }, [showScanner, onScanResult]); // Re-run effect when showScanner or onScanResult changes, onScanResult is a prop
 
    return (
        <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-center items-center text-center relative overflow-hidden group ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent pointer-events-none"></div>
            
            {!showScanner ? (
                <>
                    <span className="material-symbols-outlined text-primary text-[64px] mb-md" style={{ fontVariationSettings: '"wght" 300' }}>qr_code_scanner</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Scan Patient QR Code</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Instantly access patient medical records, verify appointments, and update status.</p>
                    <button 
                        onClick={handleOpenScanner}
                        className="bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-sm px-xl rounded-full transition-colors active:scale-95 flex items-center gap-sm"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>camera_alt</span>
                        Open Scanner
                    </button>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    {isLoadingScanner && !cameraError && (
                        <div className="flex flex-col items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined animate-spin text-[48px]">cached</span>
                            <p className="mt-2 font-body-md">Loading camera...</p>
                        </div>
                    )}
                    {cameraError && (
                        <div className="text-error text-center mb-4 p-4 border border-error-container rounded-lg bg-error-container/20">
                            <span className="material-symbols-outlined text-[48px]">error</span>
                            <p className="mt-2 font-body-md">{cameraError}</p>
                            <p className="font-body-sm text-on-error-container mt-2">Please ensure your camera is connected and permissions are granted.</p>
                        </div>
                    )}
                    {/* The div where the scanner will be rendered */}
                    <div id={qrcodeRegionId} className={`w-full max-w-sm aspect-square border-2 border-dashed border-primary rounded-lg overflow-hidden ${isLoadingScanner || cameraError ? 'hidden' : ''}`}></div>
                    <button
                        onClick={handleCloseScanner}
                        className="mt-md bg-error hover:bg-error-container text-on-error font-label-md text-label-md py-sm px-xl rounded-full transition-colors active:scale-95 flex items-center gap-sm"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                        Close Scanner
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScanQR;