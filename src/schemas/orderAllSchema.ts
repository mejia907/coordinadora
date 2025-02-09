import { z } from 'zod'

/**
 * @description Schema para el reporte general de ordenes
 */
export const orderAllSchema = z.object({
  start_date: z
    .string({ required_error: 'La fecha inicio del reporte es obligatoria' })
    .refine((value) => {
      const dateRegex = /((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/
      return dateRegex.test(value)
    }, { message: 'La fecha de inicio debe ser en el formato YYYY-MM-DD' }),
  end_date: z
    .string({ required_error: 'La fecha final del reporte es obligatoria' })
    .refine((value) => {
      const dateRegex = /((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/
      return dateRegex.test(value)
    }, { message: 'La fecha final debe ser en el formato YYYY-MM-DD' }),
})