import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createProduct (req, res) {
  const { name, price, category, description } = req.body

  if (!name || price === undefined || !category || !description) {
    return res.status(400).json({
      message: 'Failed create new product',
      error: 'Name, Price, Category or Description is required'
    })
  }

  try {
    const product = await prisma.product.create({
      data: { name, price, category, description }
    })
    res.json({ message: 'Product created', data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed create product', error: error })
  }
}

export async function getProducts (req, res) {
  const { page, limit } = req.query

  const currentPage = Number(page) || 1
  const perPage = Number(limit) || 10

  const skip = (currentPage - 1) * perPage

  try {
    const products = await prisma.product.findMany({
      where: {},
      take: perPage,
      skip: skip
    })

    return res.json({
      message: 'Get products success',
      data: products,
      pagination: {
        currentPage: currentPage,
        perPage: perPage,
        total: products.length
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed get products', error: error })
  }
}

export async function getProduct (req, res) {
  const { id } = req.params

  try {
    const product = await prisma.product.findUnique({
      where: { id: id }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.json({ message: 'Get product success', data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed get product', error: error })
  }
}

export async function updateProduct (req, res) {
  const { id, name, price, category, description } = req.body

  if (!id || !name || !price || !category || !description) {
    return res.status(400).json({
      message: 'Failed update product',
      error: 'Id, Name, Price, Category or Description is required'
    })
  }

  try {
    const product = await prisma.product.update({
      where: { id: id },
      data: { name, price, category, description }
    })
    return res.json({ message: 'Product updated', data: product })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed update product', error: error })
  }
}

export async function deleteProduct (req, res) {
  const { id } = req.body

  try {
    await prisma.product.delete({
      where: { id: id }
    })

    return res.json({ message: `Product with id ${id} deleted` })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed delete product', error: error })
  }
}
