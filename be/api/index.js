import express from 'express'
import dotenv from 'dotenv'
import router from '../src/routes/index.js'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(router)
const PORT = process.env.PORT || 5000

export default app
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
