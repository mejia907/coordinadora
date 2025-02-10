import { Request, Response } from 'express'
import { CreateOrderUseCase } from '../application/useCases/createOrderUseCase'
import { AssignRouteUseCase } from '../application/useCases/assignRouteUseCase'
import { GetOrderStatusUseCase } from '../application/useCases/getOrderStatusUseCase'
import { GetOrderAllUseCase } from '../application/useCases/getOrderAllUseCase'
import { EndRouteUseCase } from '../application/useCases/endRouteUseCase'
import { CustomRequest } from '../infrastructure/http/middelwares/authRequired'

export class OrderController {
  create = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(400).json({ message: 'Usuario no autenticado' });
      return
    }
    await CreateOrderUseCase(userId, req.body)
      .then((order) => res.status(201).json(order))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  assign = async (req: CustomRequest, res: Response) => {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(400).json({ message: 'Usuario no autenticado' });
      return
    }
    await AssignRouteUseCase(userId, Number(req.params.id), req.body.route_id, req.body.carrier_id, req.body.estimated_delivery)
      .then(() => res.status(201).json({ success: true, message: 'Orden asignada correctamente' }))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  end = async (req: Request, res: Response) => {
    await EndRouteUseCase(Number(req.params.id), req.body.actual_delivery)
      .then(() => res.status(201).json({ success: true, message: 'Orden entregada correctamente' }))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  orderStatus = async (req: Request, res: Response) => {
    await GetOrderStatusUseCase(Number(req.params.tracking))
      .then((order) => res.status(200).json(order))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  orderAll = async (req: Request, res: Response) => {
    await GetOrderAllUseCase(req.body.start_date, req.body.end_date, req.body.limit, req.body.offset, req.body.status_order_id, req.body.carrier_id)
      .then((order) => res.status(200).json(order))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}