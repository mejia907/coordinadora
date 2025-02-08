import { Router } from 'express'
import { RouteController } from '@controllers/routeController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { routeSchema } from '@schemas/routeSchema'

export class RouteRoutes {

  static get routes(): Router {
    const router = Router()
    const routeController = new RouteController()
    
    router.post('/', validateSchema(routeSchema), routeController.create);

    return router
  }
}