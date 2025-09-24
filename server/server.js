import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { prisma } from './app/prisma.js'
import authRouter from './app/auth/auth.routes.js'
import theoreticalBaseRouter from './app/theoreticalBase/theoreticalBase.routes.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT

async function main() {
    app.use(express.json())
    app.use(cors())

    app.use('/auth', authRouter)
    app.use('/api', theoreticalBaseRouter)

    app.listen(
        PORT,
        console.log(`Server listening on port ${PORT}`)
    )
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})