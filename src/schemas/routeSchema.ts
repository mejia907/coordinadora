import { z } from 'zod'

/**
 * @description Schema para la creación de rutas
 */
export const routeSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(3, { message: 'El nombre debe tener al menos 5 caracteres' }),
  origin: z
    .string({ required_error: 'El origen es obligatorio' }),
  destination: z
    .string({ required_error: 'El destino es obligatorio' }),
  distance_km: z
    .number({ required_error: 'La distancia es obligatoria (en km)', invalid_type_error: 'La distancia debe ser un número' }),
  estimated_time: z
    .number({ required_error: 'El tiempo estimado es obligatorio (en horas)', invalid_type_error: 'El tiempo estimado debe ser un número' }),
})