import { Router } from "express"
import { UserController } from "../controller/user.controller.js"

export const UserRouter = () => {
    const router = Router()

    router.get('/', UserController.filter)

    return router
}