import { Request, Response } from "express";
import csvToJson from 'convert-csv-to-json'
import { User } from '../model/user.model.js'
import { MongooseError } from 'mongoose'

export class FileController {
    static processCsv = async (req: Request, res: Response) => {
        const file = req.file

        if (!file) return res.status(400).json({ message: 'No se ha proporcionado archivo.' })
        if (file.mimetype !== 'text/csv') return res.status(400).json({ message: 'El formato del archivo no es csv.' })
        
        try {
            const string = Buffer.from(file.buffer).toString() // Pasamos de buffer o binario a string
            const json = csvToJson.fieldDelimiter(',').formatValueByType(true).csvStringToJson(string)
            await User.insertMany(json)
            return res.json({ message: "El archivo se cargó correctamente.", data: json })
            
        } catch (error) {
            if (error instanceof MongooseError) {
            return res.status(422).json({ error: error })
            }
            return res.status(500).json({ message: "El archivo no se ha podido cargar." })
        }
    }
}