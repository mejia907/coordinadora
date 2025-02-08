import { Request, Response } from 'express'
import { CreatecarrierUseCase } from '@application/useCases/createCarrierUseCase'

export class CarrierController {
  create = async (req: Request, res: Response) => {
    await CreatecarrierUseCase(req.body)
      .then((carrier) => res.status(201).json(carrier))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}