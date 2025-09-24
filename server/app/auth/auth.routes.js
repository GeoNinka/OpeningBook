import { userAuth, createAdmin } from "./auth.controller.js"
import express from 'express'

const router = express.Router()

router.route('/login').post(userAuth)
router.route('/create').post(createAdmin)

export default router