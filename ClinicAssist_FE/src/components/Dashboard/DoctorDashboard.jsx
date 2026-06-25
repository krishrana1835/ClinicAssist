import { useState } from 'react';
import { useAuthContext } from '../../Auth/AuthContext';
import ScanQR from '../common/ScanQR';
import GenerateQR from '../common/GenerateQR';
import RecentActivity from './RecentActivity';
import { dateFormatter } from '../../utils/utils';
import { useClinicContext } from '../../context/ClinicContext';

const formattedDate = dateFormatter(new Date().toString());

const DoctorDashboard = () => {
    const { user } = useAuthContext();
    const { clinicsList, isLoadingClinics, selectedClinic, setSelectedClinicId } = useClinicContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleScanClick = () => {
        console.log("Open Scanner clicked");
    };

    const handleDownloadClick = () => {
        console.log("Download QR clicked");
    };

    const handleScanResult = (decodedText) => {
        console.log("Scanned QR Code Data:", decodedText);
    };

    const handleViewAllClick = () => {
        console.log("View All Activity clicked");
    };

    const handleClinicSelect = (clinic) => {
        setSelectedClinicId(clinic.clinicId);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    const recentActivities = [
        {
            initials: 'AJ',
            name: 'Arthur Johnson',
            avatarColorClass: 'bg-secondary-container text-on-secondary-container',
            icon: 'local_hospital',
            type: 'Visit Completed',
            dateTime: 'Oct 26, 09:30 AM'
        },
        {
            initials: 'MC',
            name: 'Maria Chen',
            avatarColorClass: 'bg-primary-container text-on-primary-container',
            icon: 'prescriptions',
            type: 'Prescription Issued',
            dateTime: 'Oct 26, 08:45 AM'
        },
        {
            initials: 'RB',
            name: 'Robert Black',
            avatarColorClass: 'bg-surface-variant text-on-surface',
            icon: 'upload_file',
            type: 'Lab Results Uploaded',
            dateTime: 'Oct 25, 04:15 PM'
        }
    ];

    return (
        <div className="p-margin-mobile md:p-gutter lg:p-margin-desktop max-w-300 mx-auto w-full flex flex-col gap-lg lg:gap-xl flex-1">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Welcome back, Dr. {user?.name || 'Doctor'}</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Here is the overview for {selectedClinic?.name || 'your clinic'} today.</p>
                    <div className="mt-sm relative inline-block">
                        <button
                            className="flex items-center gap-xs px-md py-1 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                            <span className="font-label-md text-label-md">
                                {isLoadingClinics ? "Loading Clinics..." : selectedClinic?.name || "Select a Clinic"}
                            </span>
                            <span className="material-symbols-outlined text-[18px]">unfold_more</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-xs w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50">
                                {isLoadingClinics ? (
                                    <div className="p-2 text-on-surface-variant font-body-sm">Loading...</div>
                                ) : clinicsList.length > 0 ? (
                                    clinicsList.map((clinic) => (
                                        <div key={clinic.clinicId} className="p-2 hover:bg-surface-container-low cursor-pointer font-body-sm text-body-sm" onClick={() => handleClinicSelect(clinic)}>
                                            {clinic.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-on-surface-variant font-body-sm">No clinics found.</div>
                                )}
                            </div>
						)}
                    </div>
                </div>
                <p className="font-data-mono text-data-mono text-tertiary px-sm py-xs bg-surface-container rounded-md border border-outline-variant">{formattedDate}</p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-md lg:gap-gutter">
                {/* Quick Action: Scan QR (Primary focus) */}
                <ScanQR 
                    className="md:col-span-8 lg:col-span-8" 
                    onScanClick={handleScanClick} 
                    onScanResult={handleScanResult} // Pass the new handler
                />

                {/* Clinic QR Code Card */}
                <GenerateQR 
                    className="md:col-span-4 lg:col-span-4" 
                    title="Clinic QR Code"
                    description="Display this for patients to check-in automatically upon arrival."
                    onDownloadClick={handleDownloadClick}
                    qrValue={selectedClinic ? `${selectedClinic.clinicId}` : "No clinic selected"}
                />

                {/* Recent Activity Table */}
                <RecentActivity 
                    className="md:col-span-12" 
                    activities={recentActivities} 
                    onViewAllClick={handleViewAllClick}
                />
            </div>
        </div>
    );
};

export default DoctorDashboard;