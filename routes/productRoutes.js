const router = require('express').Router()
const { getAllProducts, getProduct, getProductsUnderCategory, searchForProduct, createProduct, addProductToCart} = require('../controllers/productControllers')
const {protect} = require('../controllers/authControllers')

router.get('/', getAllProducts)
router.get('/category', getProductsUnderCategory)
router.get('/search', searchForProduct)
router.get('/:id', getProduct)
router.post('/create', createProduct)
router.post('/cart/add',protect,  addProductToCart)


module.exports = router
