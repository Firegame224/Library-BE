import Express from "express";
import { BookController } from "./book.controler";
import { upload } from "../../middlewares/multer.middleware";

const bookRouter = Express.Router();
const Book =  BookController();

bookRouter.route("/")
.get(Book.getAllbook)

bookRouter.route("/:id")
.get(Book.getBookById)

export default bookRouter