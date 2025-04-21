import { Request, Response } from "express";
import { BookService } from "../Books/book.service";
import { BorrowService } from "./borrow.services";

export const BorrowController = () => {
  return {
    borrowBook: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const book_id = req.params.id;
        const Book = await BookService();
        const Borrow = await BorrowService();
        // Cari data buku
        const exitingBook = await Book.getBookbyId({ id: book_id });

        if (!exitingBook) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }

        // Pinjam buku
        const borrowBook = await Borrow.borrowBook({
          user_Id: user?.id,
          book_Id: exitingBook.id,
        });

        res.status(200).json({
          message: "Berhasil meminjam buku",
          status_code: 200,
          data: borrowBook.borrowBook,
        });
      } catch (error) {
        res.status(500).json({
          message: `Error berada di catch : ${error}`,
          status_code: 500,
        });
      }
    },
    returnBook: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const book_Id = req.params.id;
        const Book = await BookService();
        const Borrow = await BorrowService();
        // Cari data buku
        const exitingBook = await Book.getBookbyId({ id: book_Id });

        if (!exitingBook) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }

        // Kembalikan buku

        const returnBook = await Borrow.returnBook({
          book_Id,
          user_Id: user?.id,
        });
        res.status(200).json({
          message: "Berhasil mengembalikan buku",
          status_code: 200,
          data: returnBook.updateStatus,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error terjadi di Server : " + error,
          status_code: 500,
        });
      }
    },

    getBorrowedBooks: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const Borrow = await BorrowService();
        const borrowedBook = await Borrow.getBorrowedBook({
          user_Id: user?.id,
        });
        
        res.status(200).json({
          message: "Berhasil mendapatkan data buku",
          status_code: 200,
          data: borrowedBook,
        });
      } catch (error) {
        res.status(500).json({
          message: `Error terjadi di Server : ${error}`,
          status_code: 500,
        });
      }
    },
    getReturnedBooks: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;

        const Borrow = await BorrowService();

        const returnedBook = await Borrow.getReturnedBook({
          user_Id: user?.id,
        });

        res.status(200).json({
          message: "Berhasil mendapatkan data buku yg dikembalikan",
          data: returnedBook,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error terjadi di Server : " + error,
        });
      }
    },
    getLateBook: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;
        const Borrow = await BorrowService();

        const getLateBooks = await Borrow.getLateBook({
          user_Id: user?.id,
        });

        res.status(200).json({
          message: "Berhasil mendapatkan data buku yg terlambat dikembalikan",
          data: getLateBooks,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error terjadi di Server : " + error,
        });
      }
    },
  };
};
