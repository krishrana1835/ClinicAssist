import { useState } from 'react';
import MedicineManagement from './MedicineManagement';
import AssistantManagement from './AssistantManagement';

export default function ClinicSettings() {
    const [activeTab, setActiveTab] = useState('inventory');

    const switchTab = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="p-margin-mobile md:p-gutter lg:p-margin-desktop max-w-[1200px] mx-auto w-full flex flex-col gap-lg lg:gap-xl flex-1">
            {/* Page Header */}
            <div className="mb-lg flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-1">Clinic Settings</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Manage your clinic's inventory and staff permissions.</p>
                </div>
            </div>

            {/* Custom Tabs Setup */}
            <div className="mb-md border-b border-outline-variant flex gap-4 overflow-x-auto no-scrollbar">
                <button
                    className={`font-body-md text-body-md pb-2 px-1 whitespace-nowrap transition-colors ${
                        activeTab === 'inventory'
                            ? 'font-medium text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => switchTab('inventory')}
                >
                    Medicine Inventory
                </button>
                <button
                    className={`font-body-md text-body-md pb-2 px-1 whitespace-nowrap transition-colors ${
                        activeTab === 'assistants'
                            ? 'font-medium text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => switchTab('assistants')}
                >
                    Assistant Management
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'inventory' && <MedicineManagement />}
                {activeTab === 'assistants' && <AssistantManagement />}
            </div>
        </div>
    );
}