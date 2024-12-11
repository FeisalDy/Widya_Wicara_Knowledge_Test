import { Router } from 'express'
import {
  createUser,
  loginUser,
  getProfile,
  updateUser
} from '../controllers/usersController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateUser)
// router.get('/users', getUsers)
// router.get('/user', getUser)

export default router
