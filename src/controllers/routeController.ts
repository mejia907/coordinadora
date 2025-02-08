import { Request, Response } from 'express'
import { CreateRouteUseCase } from '@application/useCases/createRouteUseCase'

export class RouteController {
  create = async (req: Request, res: Response) => {
    await CreateRouteUseCase(req.body)
      .then((route) => res.status(201).json(route))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}