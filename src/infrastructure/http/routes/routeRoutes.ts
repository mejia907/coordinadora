import { Router } from 'express'
import { RouteController } from '../../../controllers/routeController'
import { validateSchema } from '../../../infrastructure/http/middelwares/validateSchema'
import { routeSchema } from '../../../schemas/routeSchema'
import { authRequired } from '../../../infrastructure/http/middelwares/authRequired'

/**
 * @description Rutas de rutas den envio
 */
export class RouteRoutes {

  static get routes(): Router {
    const router = Router()
    const routeController = new RouteController()
    
    /**
     * @swagger
     * /route:
     *   post:
     *     summary: Crear una nueva ruta
     *     description: Crea una nueva ruta en la base de datos. Requiere autenticación con token Bearer.
     *     tags:
     *       - Rutas
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Route'
     *     responses:
     *       201:
     *         description: Ruta creada exitosamente
     *       400:
     *         description: Datos inválidos en la solicitud
     *       401:
     *         description: No autorizado, token inválido
     */
    router.post('/', authRequired, validateSchema(routeSchema), routeController.create)

    return router
  }
}