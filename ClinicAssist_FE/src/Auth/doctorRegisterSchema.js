import { z } from 'zod';

export const doctorRegisterSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(15, "Contact number cannot exceed 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
  specialization: z.string().min(1, "Specialization is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const doctorRegisterDefaultValues = {
  name: "",
  email: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
  specialization: "",
};