export async function BookService() {
  return {
    getAllbook: async function (data: { limit: number; page: number }) {
      return await prisma.book.findMany({
        skip: data.limit * (data.page - 1),
        take: data.limit,
      });
    },
    getBookbyId: async function (data: { id: string }) {
      if (!data.id) {
        throw new Error("Id tidak ditemukan");
      }
      return await prisma.book.findUnique({ where: { id: data.id } });
    },
    createBook: async function (data: {
      title: string;
      image: any;
      description: string;
      stok: number;
    }) {
      const bookExist = await prisma.book.findFirst({
        where: {
          title: data.title,
        },
      });

      if (bookExist) {
        throw new Error(
          "Buku Sudah Ada, Mungkin agak bedakan sedikit judulnya?"
        );
      }
      return await prisma.book.create({
        data: {
          title: data.title,
          cover: data.image,
          description: data.description,
          stok: data.stok,
        },
      });
    },
    updateBook: async function (data: {
      id: string;
      title: string;
      stok: number;
      image: any;
      description: string | undefined;
      halaman: number | undefined;
    }) {
      const bookExist = await prisma.book.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!bookExist) {
        throw new Error("Buku Tidak Ditemukan");
      }

      return await prisma.book.update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          stok: data.stok,
          cover: data.image,
          description: data.description,
          halaman: data.halaman,
        },
      });
    },
    deleteBook: async function () {
      return await prisma.book.deleteMany(); // Ini method darurat ketika data buku terlalu banyak
    },

    deleteBookById: async function (data: { id: string }) {
      return await prisma.book.delete({
        where: {
          id: data.id,
        },
      });
    },
  };
}

