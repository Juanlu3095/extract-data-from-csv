import express from 'express'
import cors from 'cors'
import { connection } from './database/connection.js'
import { UserRouter } from './router/user.router.js'
import { FileRouter } from './router/file.router.js'

export const createApp = () => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json())

  connection()

  app.use('/api/users', UserRouter())
  app.use('/api/files', FileRouter())

  return app
}