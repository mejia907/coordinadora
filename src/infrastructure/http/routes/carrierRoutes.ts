import { Router } from 'express'
import { CarrierController } from '@controllers/carrierController'
import { validateSchema } from '@infrastructure/http/middelwares/validateSchema'
import { carrierSchema } from '@schemas/carrierSchema'
import { authRequired } from '@infrastructure/http/middelwares/authRequired'

export class CarrierRoutes {

  static get routes(): Router {
    const router = Router()
    const carrierController = new CarrierController()

    router.post('/', authRequired, validateSchema(carrierSchema), carrierController.create);

    return router
  }
}