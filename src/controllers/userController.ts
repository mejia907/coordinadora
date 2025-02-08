import { Request, Response } from 'express'
import CreateUserUseCase from '@application/useCases/createUserUseCase'

export class UserController {
  create = async (req: Request, res: Response) => {
    await CreateUserUseCase(req.body)
      .then((user) => res.status(201).json(user))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}