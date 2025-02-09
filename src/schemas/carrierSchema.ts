import { z } from 'zod'

/**
 * @description Schema para la creación de transportistas
 */
export const carrierSchema = z.object({
  user_id: z
    .number({ required_error: 'El código del usuario es obligatorio', invalid_type_error: 'El código del usuario debe ser un número' }),
  licencePlate: z
    .string({ required_error: 'La placa es obligatoria' }),
})