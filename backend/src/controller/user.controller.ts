import { Request, Response } from "express";
import { User } from "../model/user.model.js";

export class UserController {
    static filter = async (req: Request, res: Response) => {
        const { q } = req.query
        let users
        if (q) {
            users = await User.find().or([
                { nombre: { $regex : new RegExp(String(q), "i") } },
                { apellido: { $regex : new RegExp(String(q), "i") } },
                { email: { $regex : new RegExp(String(q), "i") } },
                { telefono: { $regex : new RegExp(String(q), "i") } },
                { ciudad: { $regex : new RegExp(String(q), "i") } },
                { fecha_inscripcion: { $regex : new RegExp(String(q), "i") } },
            ])
        } else {
            users = await User.find({})
        }
        return res.status(200).json({ data: users })
    }
}