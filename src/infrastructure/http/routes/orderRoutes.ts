import { Router } from 'express'
import { OrderController } from '@controllers/orderController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { assignRouteSchema, orderSchema } from '@schemas/orderSchema'

export class OrderRoutes {

  static get routes(): Router {
    const router = Router()
    const orderController = new OrderController()
    
    router.post('/', validateSchema(orderSchema), orderController.create);
    router.post('/assign/:id', validateSchema(assignRouteSchema), orderController.assign);

    return router
  }
}