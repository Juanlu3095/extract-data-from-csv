import express, { Response, Request } from 'express'
import cors from 'cors'
import csvToJson from 'convert-csv-to-json'
import multer from 'multer'
import { connection } from './database/connection.js'
import { User } from './model/user.model.js'
import { MongooseError } from 'mongoose'

const app = express()
app.disable('x-powered-by')
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
const storage = multer.memoryStorage() // Se necesita multer porque se usa FormData en el frontend
const upload = multer({ storage: storage })
connection()

app.get('/api/users', async (req: Request, res: Response) => {
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
})

app.post('/api/files', upload.single('file'), async (req: Request, res: Response) => {
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
})

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})