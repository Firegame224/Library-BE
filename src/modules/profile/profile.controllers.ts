import { Request, Response } from "express";

export async function getProfile(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    res.status(200).json({
      message:
        `Halo ${user.name} , selamat datang di Api v1 Fiky , disini adalah Api khusus untuk aplikasi buku`,
      status_code: 200,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Terjadi Error di Server ${error}`, status_code: 500 });
  }
}
