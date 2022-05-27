const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = 3030
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser: true, useUnifiedTopology: true}, ()=> {
    console.log('DB connected')
})

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use(authRoutes)


app.listen(port, () => {
    console.log('server is running')
})