import { Request, Response } from 'express'
import { CreateOrderUseCase } from '@application/useCases/createOrderUseCase'

export class OrderController {
  create = async (req: Request, res: Response) => {
    await CreateOrderUseCase(req.body)
      .then((order) => res.status(201).json(order))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}