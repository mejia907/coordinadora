import { Router } from 'express'
import { UserRoutes } from './userRoutes'

export class Routes {
  static get routes(): Router {
    const router = Router()

    //Rutas de usuarios
    router.use("/api/user", UserRoutes.routes)

    return router
  }
}
