import { useEffect } from 'react';
import { useCreateClinic, useUpdateClinic } from './useClinic';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../Auth/AuthContext';

export default function ClinicActionModal({ clinicToEdit, onClose }) {
    const { user } = useAuthContext();
    const isUpdateMode = !!clinicToEdit;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ // Removed `method: 'onSubmit'` as it's not a valid option for useForm
        defaultValues: isUpdateMode
            ? { name: clinicToEdit.name, address: clinicToEdit.address }
            : { name: '', address: '' },
    });

    useEffect(() => {
        if (isUpdateMode) {
            reset({ name: clinicToEdit.name, address: clinicToEdit.address });
        } else {
            reset({ name: '', address: '' });
        }
    }, [clinicToEdit, isUpdateMode, reset]);

    const createClinicMutation = useCreateClinic();
    const updateClinicMutation = useUpdateClinic();

    const isSubmitting = createClinicMutation.isPending || updateClinicMutation.isPending;

    const handleClinicSubmit = (data) => {
        if (isUpdateMode) {
            const payload = {
                clinicId: clinicToEdit.clinicId,
                clinicData: data,
            };
            updateClinicMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            const payload = {
                ...data,
                doctorId: user?.roleId
            };
            createClinicMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const handleCancelEdit = () => {
        reset();
        onClose();
    };

    const buttonText = isUpdateMode
        ? (isSubmitting ? "Saving Changes..." : "Save Changes")
        : (isSubmitting ? "Adding..." : "Add Clinic");

    const buttonIcon = isUpdateMode
        ? (isSubmitting ? "progress_activity" : "save")
        : (isSubmitting ? "progress_activity" : "domain_add");

    return (
        <section className="lg:col-span-4 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-sm mb-lg">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isUpdateMode ? "edit_square" : "add_business"}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                    {isUpdateMode ? "Edit Clinic" : "Add New Clinic"}
                </h3>
            </div>

            <form onSubmit={handleSubmit(handleClinicSubmit)} className="space-y-md">
                <div>
                    <label className="block font-label-md text-on-surface-variant mb-xs">Clinic Name</label>
                    <input
                        className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
                        placeholder="e.g. Westside Family Medical"
                        type="text"
                        {
                        ...register('name', {
                            required: 'Clinic name is required'
                        })
                        }
                    />
                    {
                        errors.name && (<div className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</div>)
                    }
                </div>
                <div>
                    <label className="block font-label-md text-on-surface-variant mb-xs">Clinic Address</label>
                    <textarea
                        className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
                        placeholder="Full street address, City, State, Zip"
                        rows="3"
                        {
                        ...register('address', {
                            required: 'Clinic address is required'
                        })
                        }
                    ></textarea>
                    {
                        errors.address && (<div className="mt-1 text-sm text-red-500 font-medium">{errors.address.message}</div>)
                    }
                </div>
                <div className="pt-sm">
                    <button
                        disabled={isSubmitting}
                        className={`py-md rounded-lg font-bold w-full shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-sm text-on-primary bg-primary ${isSubmitting ? 'opacity-80' : ''}`}
                        type="submit"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">{buttonIcon}</span> {buttonText}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">{buttonIcon}</span> {buttonText}
                            </>
                        )}
                    </button>
                    {isUpdateMode && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="py-md mt-2 rounded-lg font-bold w-full shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest"
                        >
                            <span className="material-symbols-outlined">cancel</span> Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}