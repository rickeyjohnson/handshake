const auth = require('express').Router()
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many failed login attempts. Try again later." },
})

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

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    res.status(201).json({ message: "User created successfully"})
})

auth.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required"})
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid email or password "})
    }

    req.session.user = user
    res.json({ message: "Login successful!" })
})

module.exports = auth