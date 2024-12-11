import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.post('/create', authenticate, createProduct)
router.get('/', authenticate, getProducts)
router.get('/:id', authenticate, getProduct)
router.put('/update', authenticate, updateProduct)
router.delete('/delete', authenticate, deleteProduct)
// router.post('/login', loginUser)
// router.get('/users', getUsers)
// router.get('/user', getUser)

export default router
