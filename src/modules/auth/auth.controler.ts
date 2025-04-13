import { Request, Response } from "express";
import { authSchema } from "./auth.validation";
import {
  checkEmailExist,
  checkToken,
  checkUser,
  createUser,
  deleteToken,
  updateUser,
} from "./auth.services";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  id: string;
      email: string;
      name: string;
      role: string;
}
export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password } = authSchema.parse(req.body);

    const name = email.split("@")[0];

    await checkEmailExist({ email, password, name });

    const user = await createUser({ email, password, name });
    res.status(201).json({
      message: "Register Berhasil",
      status_code: 201,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: `Terjadi error di server ${error}`,
      status_code: 500,
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = authSchema.parse(req.body);

    const user = await checkUser({ email, password, name: "" });

    const isMatched = await bcrypt.compare(password, user.password!);

    if (!isMatched) {
      throw new Error("Password Salah");
    }

    const Token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image : user.image,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    await updateUser({ email, password, name: "", token: Token });

    const tokenExist = await checkToken({ id: user.id });

    res.json({
      message: "Login Berhasil",
      status_code: 200,
      data: {
        id: user.id,
        name: user.name,
        image : user.image,
        email: user.email,
        role: user.role,
        token: tokenExist.token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Terjadi error di server : ${error}`,
      status_code: 500,
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    const headers = req.headers;
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Unauthorized",
        status_code: 401,
      })
    }

    const token = headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as User;

    const tokenExist = await checkToken({ id: decoded.id });

    if (!tokenExist) {
      res.status(401).json({
        message: "Token Tidak Ditemukan",
        status_code: 401,
      })
    }

    await deleteToken({ email: tokenExist.email });

    const user = await checkUser({ email: tokenExist.email});
    
    res.status(200).json({
      message: "Logout Berhasil",
      status_code: 200,
      data : user
    })
  } catch (error) {
    res.status(500).json({
      message: `Terjadi error di server : ${error}`,
      status_code: 500,
    })
  }
}