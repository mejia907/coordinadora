import { z } from 'zod'

enum TypeProduct {
  PAQUETES = 'PAQUETES',
  DOCUMENTOS = 'DOCUMENTOS',
}
/**
 * @description Schema para la creación de ordenes
 */
export const orderSchema = z.object({
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
  contact_receive: z
    .string({ required_error: 'El nombre de quien recibe es obligatorio' }),
  contact_phone: z
    .string({ required_error: 'El teléfono de quien recibe es obligatorio' }).min(8, { message: 'El teléfono de quien recibe debe tener al menos 8 caracteres' }),
  description_content: z
    .string({ required_error: 'La descripción del contenido es obligatorio' }).min(3, { message: 'La descripción del contenido debe tener al menos 3 caracteres' }),
  declared_value: z
    .number({ required_error: 'El valor declarado es obligatorio', invalid_type_error: 'El valor declarado debe ser un número' }),
  notes_delivery: z
    .string({ required_error: 'Las observaciones de la entrega es obligatoria' }).min(3, { message: 'Las observaciones de la entrega debe tener al menos 3 caracteres' }),
})

/**
 * @description Schema para la asignación de rutas
 */
export const assignRouteSchema = z.object({
  carrier_id: z.number({ required_error: 'El código del transportista es obligatorio', invalid_type_error: 'El código del transportista debe ser un número' }).int().positive(),
  route_id: z.number({ required_error: 'El código de la ruta es obligatorio', invalid_type_error: 'El código de la ruta debe ser un número' }).int().positive(),
  estimated_delivery: z
    .string({ required_error: 'La fecha estimada de entrega es obligatoria' })
    .refine((value) => {
      const dateRegex = /((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/
      return dateRegex.test(value)
    }, { message: 'La fecha estimada de entrega debe ser en el formato YYYY-MM-DD' }),
})

/**
 * @description Schema para finalizar rutas
 */
export const endRouteSchema = z.object({
  actual_delivery: z
    .string({ required_error: 'La fecha de entrega es obligatoria' })
    .refine((value) => {
      const dateRegex = /((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/
      return dateRegex.test(value)
    }, { message: 'La fecha de entrega debe ser en el formato YYYY-MM-DD' }),
})