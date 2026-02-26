import mongoose, { model } from "mongoose";

export const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    telefono: Number,
    ciudad: String,
    fecha_inscripcion: String
})
