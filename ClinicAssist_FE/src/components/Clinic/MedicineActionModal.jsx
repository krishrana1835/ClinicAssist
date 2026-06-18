import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMedicine, useUpdateMedicine } from './useMedicine';
import { medicineSchema, medicineUpdateSchema, medicineDefaultValues } from './medicineSchema';

export default function MedicineActionModal({ clinicId, medicineToEdit, onClose }) {
    const isUpdateMode = !!medicineToEdit;

    const {
        register,
        handleSubmit,
formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(isUpdateMode ? medicineUpdateSchema : medicineSchema),
        defaultValues: isUpdateMode
            ? {
                medicineName: medicineToEdit.medicineName,
                description: medicineToEdit.description,
                stock: medicineToEdit.stock,
            }
            : medicineDefaultValues,
    });

    useEffect(() => {
        if (isUpdateMode && medicineToEdit) {
            reset({
                medicineName: medicineToEdit.medicineName,
                description: medicineToEdit.description,
                stock: medicineToEdit.stock,
            });
        } else {
            reset(medicineDefaultValues);
        }
    }, [medicineToEdit, isUpdateMode, reset]);

    const createMedicineMutation = useCreateMedicine(clinicId);
    const updateMedicineMutation = useUpdateMedicine(clinicId);

    const isSubmitting = createMedicineMutation.isPending || updateMedicineMutation.isPending;

    const handleMedicineSubmit = (data) => {
        if (isUpdateMode) {
            const payload = {
                medicineId: medicineToEdit.medicineId,
                medicineData: {...data, clinicId: clinicId },
            };
            updateMedicineMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            if (isNaN(clinicId) || clinicId <= 0) {
                console.error("Invalid clinicId for creating medicine:", clinicId);
                return;
            }
            const payload = {
                ...data,
                clinicId: clinicId,
            };
            createMedicineMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-lg flex-none w-[min(92vw,32rem)]">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                        {isUpdateMode ? "Edit Medicine" : "Add New Medicine"}
                    </h3>
                    <button onClick={onClose} className="p-xs rounded-full hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleMedicineSubmit)} className="space-y-md">
                    <div>
                        <label className="block font-label-md text-on-surface-variant mb-xs">Medicine Name</label>
                        <input
                            className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
                            placeholder="e.g. Paracetamol"
                            type="text"
                            {...register('medicineName')}
                        />
                        {errors.medicineName && (<div className="mt-1 text-sm text-red-500 font-medium">{errors.medicineName.message}</div>)}
                    </div>
                    <div>
                        <label className="block font-label-md text-on-surface-variant mb-xs">Description</label>
                        <textarea
                            className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
                            placeholder="Brief description of the medicine"
                            rows="3"
                            {...register('description')}
                        ></textarea>
                        {errors.description && (<div className="mt-1 text-sm text-red-500 font-medium">{errors.description.message}</div>)}
                    </div>
                    <div>
                        <label className="block font-label-md text-on-surface-variant mb-xs">Stock</label>
                        <input
                            className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
                            type="number"
                            {...register('stock', { valueAsNumber: true })}
                        />
                        {errors.stock && (<div className="mt-1 text-sm text-red-500 font-medium">{errors.stock.message}</div>)}
                    </div>
                    <div className="pt-sm flex justify-end gap-md">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-sm px-lg rounded-lg font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            className={`py-sm px-lg rounded-lg font-bold text-on-primary bg-primary ${isSubmitting ? 'opacity-80' : ''} hover:bg-primary-hover transition-colors`}
                            type="submit"
                        >
                            {isSubmitting ? (isUpdateMode ? "Saving..." : "Adding...") : (isUpdateMode ? "Save Changes" : "Add Medicine")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}