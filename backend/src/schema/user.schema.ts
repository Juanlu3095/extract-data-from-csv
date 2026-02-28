import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    ciudad: { type: String, required: true },
    fecha_inscripcion: { type: String, required: true }
})
