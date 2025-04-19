import { Request, Response } from "express";
import { Profile } from "./profile.services";

export function ProfileController() {
  return {
    getProfile: async function (req: Request, res: Response) {
      try {
        const user = (req as any).user;
        const profile = await Profile();
        const getProfile = await profile.getProfile({ id: user.id });
        res.status(200).json({
          message: `Halo ${user.name} , selamat datang di Api v1 Fiky , disini adalah Api khusus untuk aplikasi buku`,
          status_code: 200,
          data: getProfile,
        });
      } catch (error) {
        res.status(500).json({
          message: `Terjadi Error di Server ${error}`,
          status_code: 500,
        });
      }
    },
    updateProfile: async (req: Request, res: Response) => {
      try {
        const user = (req as any).user;

        const { name } = req.body;

        const image = req.file ? req.file.path : user.image;

        const profile = await Profile();

        const updateProfile = await profile.updateprofile({
          id: user.id,
          name,
          image,
        });
        res.status(200).json({
          message: "Update Profile Berhasil",
          status_code: 200,
          data: updateProfile,
        });
      } catch (error: any) {
        if (error.message.includes("unique")) {
          res.status(400).json({
            message: "username sudah digunakan",
            status_code: 400,
          });
        } else {
          res.status(500).json({
            message: error.message,
            status_code: 500,
          });
        }
      }
    },
  };
}
