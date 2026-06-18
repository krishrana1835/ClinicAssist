import { z } from 'zod';

export const doctorProfileSchema = z.object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    contactNo: z.string().min(1, "Contact Number is required"),
    specialization: z.string().min(1, "Specialization is required"),
});

export const passwordUpdateSchema = z.object({
    newPassword: z.string()
        .min(1, "New password is required")
        .min(6, "Password must be at least 6 characters")
        .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter")
        .refine((val) => /[0-9]/.test(val), "Password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Password must contain at least one special character"),
    confirmPassword: z.string()
        .min(1, "Confirm password is required"),
}).refine((data) => {
    return data.newPassword === data.confirmPassword;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const doctorProfileDefaultValues = {
    name: "",
    email: "",
    contactNo: "", // Changed to contactNo
    specialization: "",
};

export const passwordUpdateDefaultValues = {
    newPassword: "",
    confirmPassword: "",
};