import { z } from 'zod';

export const patientRegisterSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(15, "Contact number cannot exceed 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select a blood group" }),
  }),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().positive("Weight must be a positive number").min(1, "Weight is required")
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const patientRegisterDefaultValues = {
  name: "",
  email: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
  dob: "",
  bloodGroup: "",
  weight: "",
  gender: "Male",
};