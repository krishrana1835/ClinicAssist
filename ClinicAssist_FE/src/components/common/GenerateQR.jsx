import { QRCodeCanvas } from 'qrcode.react';

const GenerateQR = ({ title = "QR Code", description = "Scan this code.", onDownloadClick, className = '', qrValue = "https://clinicaid.example.com/checkin/clinic_id_placeholder" }) => {
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-code-canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            let downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${title.replace(/\s/g, '_')}_QRCode.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        if (onDownloadClick) {
            onDownloadClick();
        }
    };

    return (
        <div className={`bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col items-center ${className}`}>
            <div className="flex justify-between items-center w-full mb-md">
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">{title}</h3>
                <button 
                    onClick={downloadQRCode}
                    className="text-primary hover:text-primary-container p-1 rounded-full hover:bg-surface-container-low transition-colors"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                </button>
            </div>
            {/* Generated QR Code */}
            <div className="bg-surface-container-low p-md rounded-lg mb-md w-full flex justify-center border border-outline-variant border-dashed">
                <QRCodeCanvas
                    id="qr-code-canvas" // Add an ID to the canvas for easy access
                    value={qrValue}
                    size={128} // Corresponds to w-32 h-32 (128px)
                    level="H" // Error correction level
                />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center px-sm">{description}</p>
        </div>
    );
};

export default GenerateQR;