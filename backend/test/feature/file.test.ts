import mongoose from "mongoose";
import { createApp } from "../../src/app.js";
import request from 'supertest'
import { User } from "../../src/model/user.model.js";
import { IUser } from "../../src/interface/user.interface.js";
import { fileURLToPath } from "url";
import path from "path";

// Se hace así porque en modules no existe dirname
const __filename = fileURLToPath(import.meta.url); // Obtiene la url del archivo donde está esto
const __dirname = path.dirname(__filename); // Obtiene la carpeta donde está el archivo

const app = createApp()
const api = request(app)

beforeEach(async () => {
    await User.deleteMany({})
})

afterAll(async () => {
    await mongoose.connection.close() // Cerramos conexión a base de datos
})

describe('file endpint', () => {
    test('a valid csv should save data in database', async () => {
        const response = await api
            .post('/api/files')
            .attach('file', path.join(__dirname, "../example-data.csv"))
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/application\/json/)

        const users = await api.get('/api/users')
        const emails = users.body.data.map((user: IUser) => user.email)

        expect(emails).toContain('ana.garcia@email.com')
    })

    test('a csv should not save data in database because schema is not valid', async () => {
        const response = await api
            .post('/api/files')
            .attach('file', path.join(__dirname, "../example-data-error.csv"))
        expect(response.statusCode).toBe(422)

        const users = await api.get('/api/users')

        expect(users.body.data).toHaveLength(0)
    })

    test('should not save data because there is no file in request', async () => {
        const response = await api
            .post('/api/files')
        expect(response.statusCode).toBe(400)

        const users = await api.get('/api/users')

        expect(users.body.data).toHaveLength(0)
    })

    test('should not save data because file is not csv', async () => {
        const response = await api
            .post('/api/files')
            .attach('file', path.join(__dirname, '../no-csv.txt'))
        expect(response.statusCode).toBe(400)

        const users = await api.get('/api/users')

        expect(users.body.data).toHaveLength(0)
    })
})