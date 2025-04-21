export async function BorrowService() {
  return {
    borrowBook: async function (data: { book_Id: string; user_Id: string }) {
      try {
        let borrowBook;
        const userExist = await prisma.users.findUnique({
          where: {
            id: data.user_Id,
          },
        });

        if (!userExist) {
          throw new Error("User Tidak Ditemukan");
        }

        const bookExist = await prisma.book.findUnique({
          where: {
            id: data.book_Id,
          },
        });

        if (!bookExist) {
          throw new Error("Buku Tidak Ditemukan");
        }

        const existBorrow = await prisma.borrowed.findUnique({
          where: {
            user_Id_book_Id: {
              user_Id: userExist.id,
              book_Id: bookExist.id,
            },
          },
        });
        if (existBorrow?.status === "Dipinjam") {
          throw new Error("Buku sudah dipinjam");
        } else if (existBorrow) {
          borrowBook = await prisma.borrowed.update({
            where: {
              user_Id_book_Id: {
                book_Id: existBorrow.book_Id,
                user_Id: existBorrow.user_Id,
              },
            },
            data: {
              borrow_At: new Date(),
              status: "Dipinjam",
            },
          })

          return { borrowBook };

        } else {
          borrowBook = await prisma.borrowed.create({
            data: {
              book_Id: data.book_Id,
              user_Id: data.user_Id,
            },
          });
        }

        const updateStok = await prisma.book.update({
          where: {
            id: borrowBook.book_Id,
          },
          data: {
            stok: {
              decrement: 1,
            },
          },
        });
        const updateStatus = await prisma.book.update({
          where: {
            id: borrowBook.book_Id,
          },
          data: {
            status: updateStok.stok === 0 ? "Dipinjam" : "Tersedia",
          },
        });

        return { updateStatus, borrowBook, updateStok };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    returnBook: async function (data: { book_Id: string; user_Id: string }) {
      try {
        const borrowedBook = await prisma.borrowed.findUnique({
          where: {
            user_Id_book_Id: {
              book_Id: data.book_Id,
              user_Id: data.user_Id,
            },
          },
        });

        if (!borrowedBook) {
          throw new Error("Tidak ada buku terpinjam");
        }
        const return_At = new Date(borrowedBook.borrow_At);

        return_At.setDate(return_At.getDate() + 7);

        const updateReturn = await prisma.borrowed.update({
          where: {
            id: borrowedBook.id,
          },
          data: {
            return_At,
            status:
              Date.now() > return_At.getTime() ? "Terlambat" : "Dikembalikan",
          },
        });

        if (
          borrowedBook.status === "Dikembalikan" ||
          borrowedBook.status === "Terlambat"
        ) {
          throw new Error("Buku sudah dikembalikan");
        }

        const updateStokBook = await prisma.book.update({
          where: {
            id: borrowedBook.book_Id,
          },
          data: {
            stok: {
              increment: 1,
            },
          },
        });

        const updateStatus = await prisma.book.update({
          where: {
            id: updateStokBook.id,
          },
          data: {
            status: updateStokBook.stok === 0 ? "Dipinjam" : "Tersedia",
          },
        });

        return { borrowedBook, updateStatus, updateStokBook, updateReturn };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    getBorrowedBook: async function (data: { user_Id: string }) {
      try {
        const borrowedBook = await prisma.borrowed.findMany({
          where: {
            user_Id: data.user_Id,
            status: "Dipinjam",
          },
        });
        
        if (borrowedBook.length === 0) {
          return [];
        }
        return borrowedBook;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    getReturnedBook: async function (data: { user_Id: string }) {
      try {
        const returnedBook = await prisma.borrowed.findMany({
          where: {
            user_Id: data.user_Id,
            status: "Dikembalikan",
          },
        });
        if (returnedBook.length === 0) {
          return [];
        }

        return returnedBook;
      } catch (error: any) {
        throw Error(error.message);
      }
    },
    getLateBook: async (data: { user_Id: string }) => {
      try {
        const lateBook = await prisma.borrowed.findMany({
          where: {
            user_Id: data.user_Id,
            status: "Terlambat",
          },
        });
        if (lateBook.length === 0) {
          return [];
        }
        return lateBook;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  };
}
