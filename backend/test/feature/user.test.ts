import mongoose from "mongoose";
import { createApp } from "../../src/app.js";
import request from 'supertest'
import { User } from "../../src/model/user.model.js";

// https://www.npmjs.com/package/ts-jest
// Se debe instalar ts-jest para TS y crear jest.config.js con el comando: npx ts-jest config:init

const app = createApp()
const api = request(app)

const initialUsers = [
    {
        "nombre": "David",
        "apellido": "Sánchez",
        "email": "david.sanchez@gmail.com",
        "telefono": "655678901",
        "ciudad": "Zaragoza",
        "fecha_inscripcion": "2026-02-13"
    },
    {
        "nombre": "Pepe",
        "apellido": "Jiménez",
        "email": "pepe.jimenez@gmail.com",
        "telefono": "655678902",
        "ciudad": "Málaga",
        "fecha_inscripcion": "2026-02-14"
    }
]

beforeEach(async () => {
    await User.deleteMany({})

    User.insertMany(initialUsers)
})

afterAll(async () => {
    await mongoose.connection.close() // Cerramos conexión a base de datos
})

describe('user endpoint', () => {
    test('should get all users with no parameters', async () => {
        const response = await api
            .get('/api/users')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/application\/json/) // Regex para comprobar que contiene application/json
        expect(response.body.data).toHaveLength(initialUsers.length)
        expect(response.body.data[0].email).toBe('david.sanchez@gmail.com')
    })

    test('should get user with parameter', async () => {
        const response = await api
            .get('/api/users?q=pepe')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/application\/json/) // Regex para comprobar que contiene application/json
        expect(response.body.data).toHaveLength(1)
        expect(response.body.data[0].email).toBe('pepe.jimenez@gmail.com')
    })
})