import { z } from 'zod'

enum TypeDocument {
  CC = 'CC',
  CE = 'CE',
  TI = 'TI'
}

export const userSchema = z.object({
  type_document: z
    .nativeEnum(TypeDocument, { errorMap: () => ({ message: 'El tipo de documento es obligatorio y debe ser CC, CE o TI' }) }),
  document: z
    .string({ required_error: 'El documento es obligatorio' }),
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z
    .string({ required_error: 'El correo es obligatorio' })
    .email({ message: 'El correo no es valido' }),
  phone: z
    .string({ required_error: 'El teléfono es obligatorio' }),
  address: z
    .string({ required_error: 'La dirección es obligatoria' }),
  role_id: z
    .number({ required_error: 'El rol es obligatorio', invalid_type_error: 'El rol debe ser un número' }),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})