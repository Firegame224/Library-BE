import prisma from "../../utils/prisma";

export function Profile() {
  return {
    updateprofile: async function (data: any) {
      const exiting = await prisma.users.findUnique({
        where : {
          name : data.name
        }
      })

      if (exiting && exiting.id !== data.id) {
        throw new Error("username sudah digunakan");
      }
      return await prisma.users.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          image : data.image
        },
      });
    },
    getProfile: async function (data: any) {
      try {
        const findProfile = await prisma.users.findUnique({
          where: {
            id: data.id,
          },
        });
        return findProfile;
      } catch (error) {
        throw new Error(`Terjadi Error di Server ${error}`);
      }
    },
  };
}
