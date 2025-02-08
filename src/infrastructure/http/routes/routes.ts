import { Router } from 'express'
import { UserRoutes } from './userRoutes'
import { OrderRoutes } from './orderRoutes'
import { RoleRoutes } from './roleRoutes'

export class Routes {
  static get routes(): Router {
    const router = Router()

    //Rutas de usuarios
    router.use("/api/user", UserRoutes.routes)

    //Rutas de ordenes
    router.use("/api/order", OrderRoutes.routes)

    //Rutas de roles
    router.use("/api/role", RoleRoutes.routes)

    return router
  }
}
