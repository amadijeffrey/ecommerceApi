const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const path = require('path')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const mongoose = require('mongoose')
const helmet = require('helmet')
const {port, DB} = require('./config')

mongoose.connect(DB,{useNewUrlParser: true, useUnifiedTopology: true}, ()=> {
    console.log('DB connected')
})

app.use(helmet())
app.use(cors({
    origin: '*', 
    optionSuccessStatus:200
}))

app.use(express.static(path.join(__dirname,'build')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use(authRoutes)

app.get('*', (res) => {
    res.sendFile(path.join(__dirname,'build', 'index.html'))
})

app.listen(port, () => {
    console.log('server is running')
})




