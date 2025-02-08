import { Router } from 'express'
import { UserController } from '@controllers/userController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { userSchema } from '@schemas/userSchema'

export class UserRoutes {

  static get routes(): Router {
    const router = Router()
    const userController = new UserController()
    
    router.post('/', validateSchema(userSchema), userController.create);

    return router
  }
}