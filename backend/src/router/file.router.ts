import { Router } from "express"
import multer from "multer"
import { FileController } from "../controller/file.controller.js"

export const FileRouter = () => {
    const router = Router()
    const storage = multer.memoryStorage() // Se necesita multer porque se usa FormData en el frontend
    const upload = multer({ storage: storage })

    router.post('/', upload.single('file'), FileController.processCsv)

    return router
}