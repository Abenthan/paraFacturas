import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string({ required_error: "Nombre completo es requerido" })
    .max(255),
  username: z
    .string({ required_error: "Nombre de usuario es requerido" })
    .max(255),
  email: z
    .string({
      required_error: "Correo electrónico es requerido",
    })
    .email({ message: "Correo electrónico no es válido" }),
  password: z
    .string({
      required_error: "Contraseña es requerida",
    })
    .min(8, {
      message: "Contraseña debe tener al menos 8 caracteres",
    })
    .max(255),
});

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Nombre de usuario es requerido" })
    .min(5)
    .max(255),
  password: z
    .string({ required_error: "Contraseña es requerida" })
    .min(5)
    .max(255),
});
