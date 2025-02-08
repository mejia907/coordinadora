import { Router } from 'express'
import { OrderController } from '@controllers/orderController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { assignRouteSchema, orderSchema } from '@schemas/orderSchema'
import { authRequired } from '@infrastructure/http/middelwares/authRequired'

export class OrderRoutes {

  static get routes(): Router {
    const router = Router()
    const orderController = new OrderController()
    
    router.post('/', authRequired, validateSchema(orderSchema), orderController.create);
    router.post('/assign/:id', authRequired, validateSchema(assignRouteSchema), orderController.assign);

    return router
  }
}