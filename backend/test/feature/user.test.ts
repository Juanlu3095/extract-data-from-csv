import mongoose from "mongoose";
import { createApp } from "../../src/app.js";
import request from 'supertest'

const app = createApp()
const api = request(app)

afterAll(async () => {
    await mongoose.connection.close()
})

describe('user endpoint', () => {
    test('should get all users', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/) // Regex para comprobar que contiene application/json
    })
})