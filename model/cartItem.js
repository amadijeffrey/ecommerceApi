const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  size: String,
  quantityOfItem: {
    type: Number,
    default: 1
  }
})
const CartItem = mongoose.model('CartItem', cartItemSchema)
module.exports = CartItem