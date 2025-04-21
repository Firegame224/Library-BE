import Express from "express";
import { BookController } from "./book.controler";
import { BorrowController } from "../borrow/borrow.controler";
import { authMiddleware } from "../../middlewares/auth.middleware";


const bookRouter = Express.Router();
const Book =  BookController();
const Borrow = BorrowController();

bookRouter.route("/")
.get(Book.getAllbook)

bookRouter.route("/:id")
.get(Book.getBookById)

bookRouter.route("/user/borrow")
.get(authMiddleware, Borrow.getBorrowedBooks)

bookRouter.route("/user/return")
.get(authMiddleware, Borrow.getReturnedBooks)

bookRouter.route("/user/late")
.get(authMiddleware , Borrow.getLateBook)

bookRouter.route("/:id/borrow")
.post(authMiddleware , Borrow.borrowBook)

bookRouter.route("/:id/return")
.post(authMiddleware , Borrow.returnBook)

export default bookRouter;