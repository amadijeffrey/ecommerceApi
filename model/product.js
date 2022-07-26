const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        description: String,
        images: [
            String
        ],
        price:Number,
        sizes: [
            String
        ],
        similarProducts: [
            Object
        ],
        rating: Number
    }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product 