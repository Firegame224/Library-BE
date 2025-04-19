import { Request, Response } from "express";

export async function Admin(req : Request , res : Response) {
    try {
        const user = (req as any).user;
        res.status(200).json({
            message: `Selamat datang di Api v1 Admin ${user.name} , disini adalah Api khusus untuk aplikasi buku`,
            status_code: 200
        })
    } catch (error) {
        res.status(500).json({
            message: `Terjadi Error di Server ${error}`,
            status_code: 500
        })
    }
}