import express, { Response, Request } from 'express'
import cors from 'cors'
import csvToJson from 'convert-csv-to-json'
import multer from 'multer'
import { connection } from './database/connection.js'
import { User } from './model/user.model.js'

const app = express()
app.disable('x-powered-by')
const port = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
connection()

app.get('/api/users', async (req: Request, res: Response) => {
  const parameter = req.query
  return res.status(200).json({ data: parameter })
})

app.post('/api/files', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file

  if (!file) return res.status(400).json({ message: 'No se ha proporcionado archivo.' })
  if (file.mimetype !== 'text/csv') return res.status(400).json({ message: 'El formato del archivo no es csv.' })
  
  try {
    const string = Buffer.from(file.buffer).toString() // Pasamos de buffer o binario a string
    const json = csvToJson.fieldDelimiter(',').formatValueByType(true).csvStringToJson(string)
    json.forEach(element => {
      const user = new User(element)
      user.save()
    })
    return res.json({ message: "El archivo se cargó correctamente.", data: json })
    
  } catch (error) {
    console.error("Error: ", error)
    return res.status(500).json({ message: "El archivo no se ha podido cargar." })
  }
  
})

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})