import { Router } from 'express'
import { RouteController } from '@controllers/routeController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { routeSchema } from '@schemas/routeSchema'
import { authRequired } from '@infrastructure/http/middelwares/authRequired'

/**
 * @description Rutas de rutas den envio
 */
export class RouteRoutes {

  static get routes(): Router {
    const router = Router()
    const routeController = new RouteController()
    
    router.post('/', authRequired, validateSchema(routeSchema), routeController.create)

    return router
  }
}