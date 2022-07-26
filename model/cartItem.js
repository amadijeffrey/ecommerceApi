const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  size: String,
  qty:Number
})
const CartItem = mongoose.model('CartItem', cartItemSchema)
module.exports = CartItem