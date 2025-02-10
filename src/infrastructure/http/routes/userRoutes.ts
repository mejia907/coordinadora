import { Router } from 'express'
import { UserController } from '../../../controllers/userController'
import { validateSchema } from '../../../infrastructure/http/middelwares/validateSchema'
import { userSchema } from '../../../schemas/userSchema'
import { authSchema } from '../../../schemas/authSchema'
import { authRequired } from '../../../infrastructure/http/middelwares/authRequired'

/**
 * @description Rutas de usuarios
 */
export class UserRoutes {

  static get routes(): Router {
    const router = Router()
    const userController = new UserController()

    /**
     * @swagger
     * /user:
     *   post:
     *     summary: Crea un nuevo usuario
     *     description: Registra un nuevo usuario en el sistema (requiere autenticación)
     *     tags:
     *       - Usuarios
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: No autorizado
     */
    router.post('/', authRequired, validateSchema(userSchema), userController.create)

    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: Iniciar sesión
     *     description: Autentica un usuario, devuelve un token JWT y la información del usuario
     *     tags:
     *       - Iniciar sesión
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Auth'
     *     responses:
     *       200:
     *         description: Inicio de sesión exitoso, devuelve un token JWT
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: Credenciales incorrectas
     */
    router.post('/login', validateSchema(authSchema), userController.login)

    return router
  }
}