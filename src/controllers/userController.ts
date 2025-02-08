import { Request, Response } from 'express'
import { CreateUserUseCase } from '@application/useCases/createUserUseCase'
import { LoginUserUseCase } from '@application/useCases/loginUserUseCase'

export class UserController {
  create = async (req: Request, res: Response) => {
    await CreateUserUseCase(req.body)
      .then((user) => res.status(201).json(user))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }

  login = async (req: Request, res: Response) => {
    await LoginUserUseCase(req.body.email, req.body.password)
      .then((user) => res.cookie("cookieApi", user?.token, { secure: true }).json({ token: user?.token, user: user?.user }))
      .catch((error) => {
        res.status(400).json({ message: error.message })
      })
  }
}