import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";
import Express from "express";

const app = Express();
const storage = new CloudinaryStorage({
  cloudinary,
  params : () => {
    return {
      folder : "profile",
      allowed_formats : ["jpg" , "png" , "jpeg", "webp"],
      public_id : Date.now().toString()
    }
  }
})

export const upload = multer({storage});