import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "./documentSchema";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadDocument } from "./usePatient";

const UploadDocumentModal = ({
  isOpen,
  onClose,
  patientId,
  selectedClinic,
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(documentSchema),
  });

  const mutation = useUploadDocument({
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", selectedClinic?.clinicId, patientId]);
      reset();
      onClose();
    }
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("documentType", data.documentType);
    formData.append("patientId", patientId);
    formData.append("clinicId", selectedClinic?.clinicId);
    mutation.mutate(formData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest p-lg rounded-xl shadow-lg z-50 border border-outline-variant">
          <div className="flex justify-between items-center mb-md">
            <Dialog.Title className="font-headline-md text-headline-md text-on-surface">
              Upload Document
            </Dialog.Title>
            <Dialog.Close asChild>
                <button className="p-xs rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer flex items-center">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            <div>
              <label htmlFor="documentType" className="block font-label-md text-on-surface-variant mb-xs">
                Document Type
              </label>
              <input
                type="text"
                id="documentType"
                {...register("documentType")}
                placeholder="e.g. Blood Test Report"
                accept=".pdf"
                className="w-full px-md py-sm rounded-lg border border-outline focus:ring-2 focus:ring-primary-container outline-none transition-all duration-200 bg-transparent text-on-surface"
              />
              {errors.documentType && (
                <p className="text-error text-xs mt-1">
                  {errors.documentType.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="file" className="block font-label-md text-on-surface-variant mb-xs">
                File
              </label>
              <input
                type="file"
                id="file"
                {...register("file")}
                className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-sm file:px-md file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-container file:text-on-secondary-container hover:file:bg-secondary-container/80 cursor-pointer"
              />
              {errors.file && (
                <p className="text-error text-xs mt-1">
                  {errors.file.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-sm pt-md">
              <button
                type="button"
                onClick={onClose}
                className="px-md py-sm text-sm font-label-md text-primary bg-transparent border border-outline-variant rounded-full hover:bg-primary-container/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-md py-sm text-sm font-label-md text-on-primary bg-primary rounded-full shadow-sm hover:bg-primary-dark disabled:bg-primary/50"
              >
                {mutation.isPending ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default UploadDocumentModal;
