import { Request, Response } from 'express'
import { CreateOrderUseCase } from '@application/useCases/createOrderUseCase'
import AssignRouteUseCase from '@application/useCases/assignRouteUseCase'

export class OrderController {
  create = async (req: Request, res: Response) => {
    await CreateOrderUseCase(req.body)
      .then((order) => res.status(201).json(order))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  assign = async (req: Request, res: Response) => {
    await AssignRouteUseCase(Number(req.params.id), req.body.route_id, req.body.carrier_id, req.body.estimated_delivery)
      .then(() => res.status(200).json({ success: true, message: 'Orden asignada correctamente' }))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}