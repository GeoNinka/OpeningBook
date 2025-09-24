import { verify, hash } from "argon2"
import { prisma } from "../prisma.js"
import asyncHandler from 'express-async-handler'
import { generateToken } from "../middleware/generateJWT.js"

export const userAuth = asyncHandler(async (req, res) => {
    const {login, password} = req.body
    const user = await prisma.user.findUnique({
        where: {
            login
        }
    })

    let isPasswordCorrect
    if (user) {
        isPasswordCorrect = await verify(user.password, password)
    } else {
        isPasswordCorrect = false
    }

    if (user && isPasswordCorrect) {
        const token = generateToken(user.id)
        res.json({ token })
    } else {
        res.status(401)
        throw new Error("Invalid login or password")
    }
})

export const createAdmin = asyncHandler(async (req, res) => {
    const user = await prisma.user.create({
        data: {
        login: process.env.login,
        password: await hash(process.env.password)
        }
    })
    res.status(200).json({ user })
})