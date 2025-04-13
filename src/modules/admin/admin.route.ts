import Express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";

const adminRouter = Express.Router();

adminRouter.get("/", authMiddleware ,(req : Express.Request , res : Express.Response) => {
    const data = (req as any).user
    if (data.role !== "admin") {
        res.status(401).json({
            message: "kamu bukan Admin",
            status_code: 401,
        })
    }
    res.send(`Selamat datang di Api v1 Admin ${data.name} , disini adalah Api khusus untuk aplikasi buku`);
})

export default adminRouter