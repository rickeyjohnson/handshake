const express = require('express')
const bcrypt = require('bcrypt')
const auth = express.Router()
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

auth.post('/signup', async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({error: "Name, email, and password are required."})
    }

    if (password.length < 8) {
        return res.status(400).json({error: "Password must be at least 8 characters long."})
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return res.status(400).json({ error: "Email already taken."})
    }

    const hashedPassword = await bcrypt.hash(password, 50)
    const newUser = await prisma.user.create({
        data: {
            name,
            username,
            password: hashedPassword,
        }
    })

    res.status(201).json({ message: "User created successfully"})
})

module.exports = auth