import { Request, Response } from 'express'
import { CreatecarrierUseCase } from '../application/useCases/createCarrierUseCase'

/**
 * @description Controlador para el manejo de transportistas
 */
export class CarrierController {
  /**
   * @param req 
   * @param res 
   * @description Controlador para la creación de transportistas
   */
  create = async (req: Request, res: Response) => {
    await CreatecarrierUseCase(req.body)
      .then((carrier) => res.status(201).json(carrier))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}