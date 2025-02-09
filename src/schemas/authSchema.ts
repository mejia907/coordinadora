import { z } from 'zod'

/**
 * @description Schema para la autenticación de usuarios
 */
export const authSchema = z.object({
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .email({ message: 'El correo no es valido' }),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})