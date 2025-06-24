const express = require('express')
const cors = require('cors')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const port = process.env.PORT | 3000

const authRouter = require('./routes/auth.js')

app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Welcome to Handshake')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})