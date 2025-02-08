import { Router } from 'express'
import { RoleController } from '@controllers/roleController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { roleSchema } from '@schemas/roleSchema'
import { authRequired } from '@infrastructure/http/middelwares/authRequired'

export class RoleRoutes {

  static get routes(): Router {
    const router = Router()
    const roleController = new RoleController()
    
    router.post('/', authRequired, validateSchema(roleSchema), roleController.create);

    return router
  }
}