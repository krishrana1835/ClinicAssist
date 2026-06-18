import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMedicines } from './useMedicine';
import MedicineActionModal from './MedicineActionModal';
import { useDeleteMedicine } from './useMedicine';

export default function MedicineManagement() {
    const { clinicId: clinicIdString } = useParams();
    const clinicId = parseInt(clinicIdString); // Parse clinicId to integer once
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [medicineToEdit, setMedicineToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: medicines, isLoading, isError } = useGetMedicines(clinicId);
    const deleteMedicineMutation = useDeleteMedicine(clinicId);

    const handleAddMedicineClick = () => {
        setMedicineToEdit(null); // Clear any previous medicine data
        setShowAddEditModal(true);
    };

    const handleEditMedicineClick = (medicine) => {
        setMedicineToEdit(medicine);
        setShowAddEditModal(true);
    };

    const handleDeleteMedicineClick = (medicineId) => {
        if (window.confirm(`Are you sure you want to delete this medicine?`)) {
            deleteMedicineMutation.mutate(medicineId);
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return { text: 'Out of Stock', class: 'bg-error-container text-on-error-container' };
        } else if (stock < 20) {
            return { text: 'Low Stock', class: 'bg-orange-200 text-orange-800' }; // Using custom orange classes
        } else if (stock < 100) {
            return { text: 'Running Low', class: 'bg-yellow-200 text-yellow-800' }; // Using custom yellow classes
        } else {
            return { text: 'In Stock', class: 'bg-green-200 text-green-800' }; // Using custom green classes
        }
    };

    const filteredMedicines = useMemo(() => {
        if (!medicines) return [];
        return medicines.filter(medicine =>
            medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [medicines, searchTerm]);

    return (
        <div className="block animate-fade-in" id="content-inventory">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-md">
                <div className="relative w-full max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm bg-surface" placeholder="Search medicines..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={handleAddMedicineClick} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm ml-4 shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    Add New Medicine
                </button>
            </div>

            {/* Inventory Table Card */}
            <div className="bg-surface rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col relative">
                {/* Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl"></div>
                <div className="table-container overflow-x-auto pl-1">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-low">
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Medicine Name</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Description</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Stock</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                                <th className="p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="font-body-sm text-body-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-on-surface-variant">Loading medicines...</td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-error">Error loading medicines.</td>
                                </tr>
                            ) : medicines?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-on-surface-variant">No medicines found for this clinic.</td>
                                </tr>
                            ) : (
                                filteredMedicines.map((medicine) => {
                                    const { text: stockStatusText, class: stockStatusClass } = getStockStatus(medicine.stock);
                                    return (
                                        <tr key={medicine.medicineId} className={`border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group ${medicine.stock > 0 && medicine.stock < 100 ? 'bg-surface-container-low bg-opacity-30' : ''}`}>
                                            <td className="p-4 font-medium text-on-surface">{medicine.medicineName}</td>
                                            <td className="p-4 text-on-surface-variant">{medicine.description}</td>
                                            <td className="p-4 font-data-mono text-data-mono text-on-surface">{medicine.stock.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-md text-label-md ${stockStatusClass}`}>
                                                    {stockStatusText}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleEditMedicineClick(medicine)} className="text-outline hover:text-primary transition-colors p-1">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteMedicineClick(medicine.medicineId)} className="text-outline hover:text-error transition-colors p-1">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showAddEditModal && (
                <MedicineActionModal clinicId={clinicId} medicineToEdit={medicineToEdit} onClose={() => setShowAddEditModal(false)} />
            )}
        </div>
    );
}