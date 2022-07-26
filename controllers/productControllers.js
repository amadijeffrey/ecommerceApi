const CartItem = require('../model/cartItem')
const Product = require('../model/product')
const User = require('../model/user')

const getFeaturedProducts = async ( req, res) => {
    try{
        const allProducts = await Product.find()
        if(!allProducts)return res.status(404).json({status: 'fail', message: 'products not found'})

        const featuredProducts = []

        for(let i = 0; i < 10; i++){
            const randomIndex = Math.floor(Math.random() * allProducts.length)
            featuredProducts.push(allProducts[randomIndex])
        }
        res.status(200).json({status: 'success', featuredProducts})
    } catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}

const getProduct = async (req, res) => {
    try{
        const { id } = req.params
        const foundProduct = await Product.findById(id)
        if(!foundProduct)return res.status(404).json({status: 'fail' , message: 'product not found'})
        const listOfProducts = await Product.find({category: foundProduct.category})

        for(let i = 0; i < 4; i++){
            const randomIndex = Math.floor(Math.random() * listOfProducts.length)
            foundProduct.similarProducts.push(listOfProducts[randomIndex])
        }

        res.status(200).json({status: 'success', foundProduct})
    } catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}

const getProductsUnderCategory = async (req, res) => {
    try{
        const { category } = req.query
        const actualCategory = decodeURIComponent(category)
        const foundProducts = await Product.find({category: actualCategory})
        if(foundProducts.length === 0 )return res.status(404).json({status: 'fail', message: 'products with that category not found'})
        res.status(200).json({status: 'success', foundProducts})
    } catch(err){
        res.status(500).json({ message:'something went wrong'})
    }
}

const createProduct = async (req, res) => {
    try{
        const { name, images, description,category, price, sizes, rating} = req.body
        const newProductOptions = {
            name,
            images,
            description,
            category,
            price,
            sizes,
            rating
        }
     
        const newProduct = await Product.create(newProductOptions)
        res.status(200).json({status: 'success', newProduct})
    } catch(err){
        res.status(500).json({ message: 'something went wrong'})
    }
}

const searchForProduct = async (req, res) => {
    try{
        const { name } = req.query
        if(!name) return
        const regex = new RegExp(name, 'i')
        const foundProduct = await Product.find({name: {$regex: regex}})
        if(!foundProduct.length === 0)return res.status(404).json({status: 'fail', message: 'no product matches that name'})
        res.status(200).json({ status: 'success', foundProduct })
    } catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}

const addProductToCart = async(req,res) => {
    try{
    const user = await User.findById(req.user._id)
    const { name, image, price, size, qty} = req.body
    const product = {
        name,
        image,
        price,
        size,
        qty
    }
    const newCartItem = await CartItem.create(product)
    user.cart.push(newCartItem)
    user.save()
    res.status(201).json({status: 'success', newCartItem})
    }catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }

}

const updateCartItem = async(req,res) => {
    try{
        const { id } = req.params
        const { qty } = req.body
        const user = await User.findById(req.user._id)

        const updatedCartItem = await CartItem.findByIdAndUpdate(id,{qty}, {new:true} )
        user.cart.push(updatedCartItem)
        user.save()
        res.status(201).json({status: 'success', updatedCartItem})

    }catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}


const deleteCartItem = async(req,res) => {
    try{
        const { id } = req.params
        await CartItem.findByIdAndRemove(id )
        res.status(201).json({status: 'success', id})


    }catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}

const addReferenceToUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        const { reference } = req.body

        user.ref = reference
        user.save()
        res.status(200).json({ status: 'success', message: 'Your order has been received. It would be shipped soon.' })

    } catch(err){
        res.status(500).json({ message: 'something went wrong' })
    }
}

module.exports = { getFeaturedProducts, getProduct, getProductsUnderCategory, 
    createProduct, searchForProduct, addProductToCart,updateCartItem, deleteCartItem, addReferenceToUser }