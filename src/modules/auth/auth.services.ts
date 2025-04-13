import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  token?: string;
}
export const checkEmailExist = async (data: User) => {
  const emailexist = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (emailexist) {
    throw new Error("Email sudah terdaftar");
  }
};

export const createUser = async (data: User) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return await prisma.users.create({
    data: {
      email: data.email,
      password: hashPassword,
      name: data.name,
    },
  });
};

export const updateUser = async (data: User) => {
  return await prisma.users.update({
    where: {
      email: data.email,
    },
    data: {
      token: data.token,
    },
  });
};

export const deleteToken = async (data: any) => {
  return await prisma.users.update({
    where: {
      email: data.email,
    },
    data: {
      token: null,
    },
  });
}

export const checkToken = async (data : { id : string }) => {

  const tokenExist = await prisma.users.findFirst({
    where : {
      id : data.id
    }
  })

  if (!tokenExist) {
    throw new Error(`Account Tidak Ditemukan`);
  }
  
  return tokenExist;
}
export const checkUser = async (data: any) => {
  const userExist = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });

  if (!userExist) {
    throw new Error("User Tidak Ditemukan");
  }

  return userExist;
};

