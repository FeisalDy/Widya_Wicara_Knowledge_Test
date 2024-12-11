import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createUser (req, res) {
  const { name, email, password, gender } = req.body
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, gender }
    })
    res.json({ message: 'Account created successfully', data: user })
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: error })
  }
}

export async function loginUser (req, res) {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.json({ message: 'Login successful', token })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export async function getProfile (req, res) {
  const { id } = req.user

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, name: true, email: true, gender: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    return res.json({ data: user })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export async function updateUser (req, res) {
  const { id } = req.user
  const { name, email, gender } = req.body

  const isEmailExist = await prisma.user.findUnique({ where: { email } })
  if (isEmailExist && isEmailExist.id !== id) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { name, email, gender }
    })
    return res.json({ message: 'User updated', data: user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed update user', error: error })
  }
}
