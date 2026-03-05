import { z } from "zod";

export const usernameValidator = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be max 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscore allowed");

export const emailValidator = z
  .string()
  .trim()
  .email("Invalid email format")
  .toLowerCase();

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character");

export const confirmPasswordValidator = z.string();