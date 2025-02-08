import { Router } from 'express'
import { UserController } from '@controllers/userController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { userSchema } from '@schemas/userSchema'
import { authSchema } from '@schemas/authSchema'
import { authRequired } from '@infrastructure/http/middelwares/authRequired'

export class UserRoutes {

  static get routes(): Router {
    const router = Router()
    const userController = new UserController()
    
    router.post('/', authRequired, validateSchema(userSchema), userController.create);
    router.post('/login', validateSchema(authSchema), userController.login);

    return router
  }
}