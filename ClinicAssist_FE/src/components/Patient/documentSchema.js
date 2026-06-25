import { z } from "zod";

export const documentSchema = z.object({
  documentType: z.string().min(3, "Document type must be at least 3 characters"),
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "File is required."),
});
