import { Router } from 'express'
import { CarrierController } from '@controllers/carrierController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { carrierSchema } from '@schemas/carrierSchema'

export class CarrierRoutes {

  static get routes(): Router {
    const router = Router()
    const carrierController = new CarrierController()
    
    router.post('/', validateSchema(carrierSchema), carrierController.create);

    return router
  }
}