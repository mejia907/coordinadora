import { Router } from 'express'
import { RoleController } from '../../../controllers/roleController'
import { validateSchema } from '../../../infrastructure/http/middelwares/validateSchema'
import { roleSchema } from '../../../schemas/roleSchema'
import { authRequired } from '../../../infrastructure/http/middelwares/authRequired'

/**
 * @description Rutas de roles
 */
export class RoleRoutes {

  static get routes(): Router {
    const router = Router()
    const roleController = new RoleController()
    
    /**
     * @swagger
     * /role:
     *   post:
     *     summary: Crear un nuevo rol
     *     description: Crea un nuevo rol en la base de datos. Requiere autenticación con token Bearer.
     *     tags:
     *       - Roles
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Role'
     *     responses:
     *       201:
     *         description: Rol creado exitosamente
     *       400:
     *         description: Datos inválidos en la solicitud
     *       401:
     *         description: No autorizado, token inválido
     */    
    router.post('/', authRequired, validateSchema(roleSchema), roleController.create)

    return router
  }
}