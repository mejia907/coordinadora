import { z } from 'zod'

export const roleSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
})