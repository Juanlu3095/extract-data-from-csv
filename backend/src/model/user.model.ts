import { userSchema } from "../schema/user.schema.js";
import { model } from "mongoose";

// El nombre del modelo debe ser en singular, mongoose lo convierte en plural para la base de datos
export const User = model('User', userSchema)