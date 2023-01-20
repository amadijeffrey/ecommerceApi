const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const path = require('path')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const mongoose = require('mongoose')
const helmet = require('helmet')
const {DB} = require('./config')
const port = process.env.PORT || 3030

mongoose.connect(DB,{useNewUrlParser: true, useUnifiedTopology: true}, ()=> {
    console.log('DB connected')
})

app.use(helmet())
app.use(cors({
    origin: '*', 
    optionSuccessStatus:200
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use(authRoutes)


app.get('/health', (req,res) => {
 res.send({'message': "okay"})
})
app.listen(port, () => {
    console.log('server is running')
})





