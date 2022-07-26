const router = require('express').Router()
const { getFeaturedProducts, getProduct, getProductsUnderCategory,
     searchForProduct, createProduct, addProductToCart, addReferenceToUser, 
    deleteCartItem, updateCartItem} = require('../controllers/productControllers')
const {isLoggedIn} = require('../controllers/authControllers')

router.get('/featured', getFeaturedProducts)
router.get('/category', getProductsUnderCategory)
router.get('/search', searchForProduct)
router.get('/:id', getProduct)
router.post('/create', createProduct)
router.post('/cart/add', isLoggedIn,  addProductToCart)
router.delete('/cart/delete/:id', isLoggedIn,  deleteCartItem)
router.patch('/cart/:id', isLoggedIn,  updateCartItem)
router.post('/payment/reference', isLoggedIn, addReferenceToUser )




module.exports = router
