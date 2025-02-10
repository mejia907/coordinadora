import { Router } from 'express'
import { OrderController } from '../../../controllers/orderController'
import { validateSchema } from '../../../infrastructure/http/middelwares/validateSchema'
import { assignRouteSchema, endRouteSchema, orderSchema } from '../../../schemas/orderSchema'
import { authRequired } from '../../../infrastructure/http/middelwares/authRequired'
import { orderAllSchema } from '../../../schemas/orderAllSchema'

/**
 * @description Rutas de ordenes
 */
export class OrderRoutes {

  static get routes(): Router {
    const router = Router()
    const orderController = new OrderController()

    /**
     * @swagger
     * tags:
     *   name: Ordenes
     *   description: Gestión de órdenes de envíos
     */

    /**
     * @swagger
     * /order:
     *   post:
     *     summary: Crear una nueva orden
     *     description: Crea una nueva orden en la base de datos. Requiere autenticación con token Bearer.
     *     tags: [Ordenes]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Order'
     *     responses:
     *       201:
     *         description: Orden creada exitosamente
     *       400:
     *         description: Datos inválidos en la solicitud
     *       401:
     *         description: No autorizado, token inválido
     */
    router.post('/', authRequired, validateSchema(orderSchema), orderController.create)

    /**
     * @swagger
     * /order/assign/{id}:
     *   put:
     *     summary: Asignar transportista a una orden
     *     description: Asigna un transportista, ruta y fecha estimada de entrega a una orden específica. Requiere autenticación.
     *     tags: [Ordenes]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID de la orden a asignar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AssignOrder'
     *     responses:
     *       200:
     *         description: Orden asignada exitosamente
     *       400:
     *         description: Datos inválidos
     *       404:
     *         description: Orden no encontrada
     */
    router.put('/assign/:id', authRequired, validateSchema(assignRouteSchema), orderController.assign)

    /**
     * @swagger
     * /order/end-route/{id}:
     *   put:
     *     summary: Finalizar ruta de entrega de una orden
     *     description: Asigna la fecha de entrega a una orden específica. Requiere autenticación.
     *     tags: [Ordenes]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: number
     *         required: true
     *         description: ID de la orden a finalizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EndRoute'
     *     responses:
     *       200:
     *         description: Orden finalizada exitosamente
     *       400:
     *         description: Datos inválidos
     *       404:
     *         description: Orden no encontrada
     */
    router.put('/end-route/:id', authRequired, validateSchema(endRouteSchema), orderController.end)

    /**
     * @swagger
     * /order/status/{id}:
     *   get:
     *     summary: Obtener el estado de una orden
     *     description: Devuelve el estado actual de una orden específica. Requiere autenticación.
     *     tags: [Ordenes]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID de la orden
     *     responses:
     *       200:
     *         description: Estado de la orden obtenido exitosamente
     *       404:
     *         description: Orden no encontrada
     */
    router.get('/status/:id', authRequired, orderController.orderStatus)


    /**
     * @swagger
     * /order/all:
     *   get:
     *     summary: Obtener todas las órdenes
     *     description: Devuelve una lista de todas las órdenes de acuerdo a un rango de fechas. Requiere autenticación.
     *     tags: [Ordenes]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/OrderAll'
     *     responses:
     *       200:
     *         description: Lista de órdenes obtenida exitosamente
     *       401:
     *         description: No autorizado
     */
    router.get('/all', authRequired, validateSchema(orderAllSchema), orderController.orderAll)

    return router
  }
}