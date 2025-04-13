import Express  from "express";
import userRouter from "./modules/auth/auth.route";
import { randomUUID } from "crypto";
import { authMiddleware } from "./middleware/auth.middleware";
import profileRouter from "./modules/profile/profile.route";
import adminRouter from "./modules/admin/admin.route";

const app = Express();
const port = 3000;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/api/v1", (req : Express.Request , res : Express.Response) => {
    res.send("Selamat datang di Api v1 Fiky , disini adalah Api khusus untuk aplikasi buku");
});

app.use("/api/v1/auth" , userRouter);

app.use("/api/v1/profile" , profileRouter);

app.use("/api/v1/admin" , adminRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
