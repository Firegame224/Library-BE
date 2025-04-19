import { Request, Response } from "express";
import { BookService } from "./book.service";
import { bookSchema } from "./book.validation";

export function BookController() {
  return {
    getAllbook: async (req: Request, res: Response) => {
      try {
        const { page, limit } = req.query;
        const Books = await BookService();
        const getAllbook = await Books.getAllbook({
          limit: Number(limit),
          page: Number(page),
        });
        if (getAllbook.length === 0) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }
        res.status(200).json({
          message: "Berhasil mendapatkan semua data buku",
          status_code: 200,
          data: getAllbook,
          pagination: {
            limit: Number(limit),
            Page: Number(page),
          },
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    getBookById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const Book = await BookService();
        const getbookById = await Book.getBookbyId({ id });
        if (!getbookById) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }
        res.status(200).json({
          message: "Berhasil mendapatkan data buku",
          status_code: 200,
          data: getbookById,
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    createBook: async (req: Request, res: Response) => {
      try {
        const { title, stok, description } = bookSchema.parse(req.body);
        if (!title || !stok || !description) {
          res.status(400).json({
            message: "Data buku tidak lengkap",
            status_code: 400,
          });
          return;
        }
        const image = req.file ? req.file.path : null;
        const Book = await BookService();
        const createBook = await Book.createBook({
          title,
          stok: Number(stok),
          image,
          description,
        });
        res.status(201).json({
          message: "Berhasil membuat data buku",
          status_code: 200,
          data: createBook,
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    updateBook: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { title, stok, description, halaman } = bookSchema.parse(
          req.body
        );
        const Book = await BookService();
        const exitingBook = await Book.getBookbyId({ id });

        if (!exitingBook) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }

        const image = req.file ? req.file.path : exitingBook.cover;

        const updateBook = await Book.updateBook({
          id,
          title,
          stok: Number(stok),
          image,
          description,
          halaman: Number(halaman),
        });

        res.status(200).json({
          message: "Berhasil update data buku",
          status_code: 200,
          data: updateBook,
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    deleteBookById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const Book = await BookService();
        const exitingBook = await Book.getBookbyId({ id });
        if (!exitingBook) {
          res.status(404).json({
            message: "Data buku tidak ditemukan",
            status_code: 404,
          });
          return;
        }

        const deletedBook = await Book.deleteBookById({ id: exitingBook.id });

        res.status(200).json({
          message: "Berhasil menghapus data buku",
          status_code: 200,
          data: deletedBook,
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    searchBook: async () => {},
  };
}

const Borrow = () => {
  return {
    borrowBook: async () => {},
    returnBook: async () => {},
    getBorrowedBook: async () => {},
    getHistoryBook: async () => {},
  };
};
