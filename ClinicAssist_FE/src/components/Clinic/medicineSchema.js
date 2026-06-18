import { z } from 'zod';

export const medicineSchema = z.object({
    medicineName: z.string().min(1, 'Medicine name is required'),
    description: z.string().optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export const medicineDefaultValues = {
    medicineName: '',
    description: '',
    stock: 0,
};

export const medicineUpdateSchema = z.object({
    medicineName: z.string().min(1, 'Medicine name is required').optional(),
    description: z.string().optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
});