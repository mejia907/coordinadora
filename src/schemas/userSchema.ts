import { z } from 'zod'

export const userSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio'})
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z
    .string({ required_error: 'El correo es obligatorio'})
    .email({ message: 'El correo no es valido' }),
  phone: z
    .string({ required_error: 'El teléfono es obligatorio'}),
  address: z
    .string({ required_error: 'La dirección es obligatoria'}),
  role_id: z
    .number({ required_error: 'El rol es obligatorio', invalid_type_error: 'El rol debe ser un número' }),  
  password: z
    .string({ required_error: 'La contraseña es obligatoria'})
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})