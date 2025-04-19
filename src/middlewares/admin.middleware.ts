import { NextFunction, Request, Response } from "express";

export async function AdminMiddleware(req : Request , res : Response , next : NextFunction) {
    try {
        const user = (req as any).user;
        if (user.role !== "admin") {
            res.status(401).json({
                message: "Unauthorized",
                status_code: 401
            })
        }
        next();
    } catch (error) {
        throw new Error(`Terjadi Error di Server ${error}`);
    }
}