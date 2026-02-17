import express, { Response, Request } from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors())

app.get('/api/users', async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Datos recibidos correctamente.' })
})

app.post('/api/files', async (req: Request, res: Response) => {
    
})

app.listen(port, () => {
  console.log(`Escuchando en puerto ${port}`)
})