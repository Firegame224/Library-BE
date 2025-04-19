import {z} from "zod";

export const bookSchema = z.object({
    title : z.string().min(3),
    stok : z.string(),
    halaman : z.string().optional(),
    description : z.string().min(3).optional(),
})