import { NextFunction, Request, Response } from "express";
import { checkToken } from "../modules/auth/auth.services";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers;
  if (!headers.authorization || !headers.authorization.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorized",
      status_code: 401,
    });
  }

  const token = headers.authorization?.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      name: string;
      role: string;
      token: string;
    };

    const tokenExist = await checkToken({id : decoded.id});

    if (!tokenExist.token) {
      res.status(401).json({
        message: "Token tidak ditemukan",
        status_code: 401,
      });
    }

    (req as any).user = tokenExist;
    next();
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token Expired",
        status_code: 401,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Token Invalid",
        status_code: 401,
      });
    }
    if (error instanceof jwt.NotBeforeError) {
      res.status(401).json({
        message: "Token Not Active",
        status_code: 401,
      });
    }
    res.status(500).json({
      message: `Terjadi error di server ${error}`,
      status_code: 500,
    });
  }
};
