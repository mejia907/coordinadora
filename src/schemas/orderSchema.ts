import { z } from 'zod'

enum TypeProduct {
  PAQUETES = 'PAQUETES',
  DOCUMENTOS = 'DOCUMENTOS',
}

export const orderSchema = z.object({
  user_id: z
    .number({ required_error: 'El código del usuario es obligatorio', invalid_type_error: 'El código del usuario debe ser un número' }),
  type_product: z
    .nativeEnum(TypeProduct, { errorMap: () => ({ message: 'El tipo del producto es obligatorio y debe ser PAQUETES ó DOCUMENTOS' }) }),
  weight: z
    .number({ required_error: 'El peso es obligatorio', invalid_type_error: 'El peso debe ser un número' }),
  dimension_long: z
    .number({ required_error: 'La longitud es obligatoria', invalid_type_error: 'La longitud debe ser un número' }),
  dimension_tall: z
    .number({ required_error: 'La altura es obligatoria', invalid_type_error: 'La altura debe ser un número' }),
  dimension_width: z
    .number({ required_error: 'El ancho es obligatorio', invalid_type_error: 'El ancho debe ser un número' }),
  amount: z
    .number({ required_error: 'La cantidad es obligatoria', invalid_type_error: 'La cantidad debe ser un número' }),
  destination_address: z
    .string({ required_error: 'La dirección es obligatoria' }),
  destination_city: z
    .string({ required_error: 'La ciudad es obligatoria' }).min(3, { message: 'La ciudad debe tener al menos 3 caracteres' }),
  carrier_id: z
    .number({ required_error: 'El código del mensajero es obligatorio', invalid_type_error: 'El código del mensajero debe ser un número' }),
  estimated_delivery: z
    .string({ required_error: 'La fecha estimada de entrega es obligatoria' })
    .refine((value) => {
      const dateRegex = /((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/
      return dateRegex.test(value)
    }, { message: 'La fecha estimada de entrega debe ser una fecha válida en el formato YYYY-MM-DD' }),
})