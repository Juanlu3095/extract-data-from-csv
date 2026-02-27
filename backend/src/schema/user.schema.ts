import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    telefono: String,
    ciudad: String,
    fecha_inscripcion: String
})
