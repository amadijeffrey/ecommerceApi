const CartItem = require('../model/cartItem')
const Product = require('../model/product')
const User = require('../model/user')

const getAllProducts = async ( req, res) => {
    try{
        const allProducts = await Product.find()
        if(!allProducts)return res.status(404).json({message: 'products not found'})
        res.status(200).json({message: 'success', allProducts})
    } catch(err){
        res.status(500).json({ error: 'something went wrong' })
    }
}

const getProduct = async (req, res) => {
    try{
        const { id } = req.params
        const foundProduct = await Product.findById(id)
        if(!foundProduct)return res.status(404).json({message: 'product not found'})
        res.status(200).json({message: 'success', foundProduct})
    } catch(err){
        res.status(500).json({ error: 'something went wrong' })
    }
}

const getProductsUnderCategory = async (req, res) => {
    try{
        const { category } = req.query
        const actualCategory = decodeURIComponent(category)
        const foundProducts = await Product.find({category: actualCategory})
        if(foundProducts.length === 0 )return res.status(404).json({message: 'products with that category not found'})
        res.status(200).json({message: 'success', foundProducts})
    } catch(err){
        res.status(500).json({ error:'something went wrong'})
    }
}

const createProduct = async (req, res) => {
    try{
        const { name, images, description,category, price, sizes} = req.body
        const newProductOptions = {
            name,
            images,
            description,
            category,
            price,
            sizes
        }
     
        const newProduct = await Product.create(newProductOptions)
        res.status(200).json({message: 'success', newProduct})
    } catch(err){
        res.status(500).json({ error: 'something went wrong'})
    }
}

const searchForProduct = async (req, res) => {
    try{
        const { name } = req.query
        const regex = new RegExp(name, 'i')
        const foundProduct = await Product.find({name: {$regex: regex}})
        if(!foundProduct.length === 0)return res.status(404).json({message: 'no product matches that name'})
        res.status(200).json({ foundProduct })
    } catch(err){
        res.status(500).json({ error: 'something went wrong' })
    }
}

const addProductToCart = async(req,res) => {
    const user = await User.findById(req.user._id)
    const { name, image, price, size} = req.body
    const product = {
        name,
        image,
        price,
        size
    }
    const newCartItem = await CartItem.create(product)
    user.cart.push(newCartItem)
    user.save()
    res.status(201).json({message: 'success', newCartItem})

}

module.exports = { getAllProducts, getProduct, getProductsUnderCategory, createProduct, searchForProduct, addProductToCart}