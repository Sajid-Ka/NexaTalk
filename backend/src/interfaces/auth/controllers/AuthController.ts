import { Request, Response } from "express";
import { RegisterUser } from "../../../application/auth/usecases/RegisterUser";
import { registerSchema } from "../validators/registerValidator";

export class AuthController {
  constructor(private registerUser: RegisterUser) {}

  signup = async (req: Request, res: Response) => {
    const dto = registerSchema.parse(req.body);

    const user = await this.registerUser.execute(dto);

    res.status(201).json(user);
  };
}
