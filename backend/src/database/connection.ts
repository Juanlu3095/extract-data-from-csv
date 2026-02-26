import mongoose from "mongoose";

const { DB_USER, DB_PASS, DB_NAME } = process.env

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@extract-data-from-csv.vszugsi.mongodb.net/${DB_NAME}`

export const connection = async () => {
    await mongoose.connect(connectionString)
        .then(() => console.log("Conexión realizada con éxito a MongoDB."))
        .catch((error) => console.error("Error al conectar a MongoDB: ", error))
}