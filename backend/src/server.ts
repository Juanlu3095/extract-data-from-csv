import express, { Response, Request } from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())

app.get('/api/users', async (req: Request, res: Response) => {
  const parameter = req.query
  return res.status(200).json({ data: parameter })
})

app.post('/api/files', async (req: Request, res: Response) => {
  return res.json({ message: "El archivo se cargó correctamente." })
  return res.status(500).json({ message: "El archivo no se ha podido cargar." })
})

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})