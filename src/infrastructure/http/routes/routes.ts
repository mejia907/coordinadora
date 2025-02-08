import { Router } from 'express'
import { UserRoutes } from './userRoutes'
import { OrderRoutes } from './orderRoutes'

export class Routes {
  static get routes(): Router {
    const router = Router()

    //Rutas de usuarios
    router.use("/api/user", UserRoutes.routes)

    //Rutas de ordenes
    router.use("/api/order", OrderRoutes.routes)

    return router
  }
}
