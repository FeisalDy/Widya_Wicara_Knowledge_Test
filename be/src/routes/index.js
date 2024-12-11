import { Router } from 'express'
import UserRouter from './user.js'
import ProductRouter from './product.js'

const router = Router()

router.use('/api/user', UserRouter)
router.use('/api/product', ProductRouter)

export default router
