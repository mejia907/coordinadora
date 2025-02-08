import { Router } from 'express'
import { RoleController } from '@controllers/roleController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { roleSchema } from '@schemas/roleSchema'

export class RoleRoutes {

  static get routes(): Router {
    const router = Router()
    const roleController = new RoleController()
    
    router.post('/', validateSchema(roleSchema), roleController.create);

    return router
  }
}