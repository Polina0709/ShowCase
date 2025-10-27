import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Enter name"),
    lastName: z.string().min(2, "Enter last name"),
    email: z.string().email(),
    password: z.string().min(6, "At least 6 chars"),
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginSchema = z.infer<typeof loginSchema>;
