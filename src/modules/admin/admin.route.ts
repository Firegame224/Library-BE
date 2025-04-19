import Express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { Admin } from "./admin.controler";
import { AdminMiddleware } from "../../middlewares/admin.middleware";
import { BookController } from "../Books/book.controler";
import { upload } from "../../middlewares/multer.middleware";

const adminRouter = Express.Router();
const Book = BookController();

adminRouter.get("/", authMiddleware, AdminMiddleware ,Admin);
adminRouter.get("/books" , authMiddleware, AdminMiddleware ,Book.getAllbook);
adminRouter.get("/books/:id" , authMiddleware, AdminMiddleware ,Book.getBookById);
adminRouter.post("/books" , authMiddleware, AdminMiddleware, upload.single("image") ,Book.createBook);
adminRouter.patch("/books/:id" , authMiddleware, AdminMiddleware, upload.single("image") ,Book.updateBook);
adminRouter.delete("/books/:id" , authMiddleware, AdminMiddleware ,Book.deleteBookById);

export default adminRouter;