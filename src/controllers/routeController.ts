import { Request, Response } from 'express'
import { CreateRouteUseCase } from '../application/useCases/createRouteUseCase'

/**
 * @description Controlador para el manejo de rutas de envio
 */
export class RouteController {
  /**
   * @param req 
   * @param res 
   * @description Controlador para crear rutas de envio
   */
  create = async (req: Request, res: Response) => {
    await CreateRouteUseCase(req.body)
      .then((route) => res.status(201).json(route))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}