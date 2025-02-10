import { Router } from 'express'
import { CarrierController } from '../../../controllers/carrierController'
import { validateSchema } from '../../../infrastructure/http/middelwares/validateSchema'
import { carrierSchema } from '../../../schemas/carrierSchema'
import { authRequired } from '../../../infrastructure/http/middelwares/authRequired'

/**
 * @description Rutas de transportistas
 */
export class CarrierRoutes {

  static get routes(): Router {
    const router = Router()
    const carrierController = new CarrierController()

    /**
     * @swagger
     * /carrier:
     *   post:
     *     summary: Crear un transportista
     *     description: Crea un nuevo transportista en el sistema.
     *     tags:
     *       - Transportistas
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Carrier"
     *     responses:
     *       201:
     *         description: Transportista creado exitosamente.   
     *       400:
     *         description: Datos inválidos en la solicitud.
     *       401:
     *         description: No autorizado.
     */
    router.post('/', authRequired, validateSchema(carrierSchema), carrierController.create)

    return router
  }
}