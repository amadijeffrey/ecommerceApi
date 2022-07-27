const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../model/user')
const {jwtSecretKey, jwtExpiry} = require('../config')


const signToken = (id) => {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiry })
}


const createAndSendToken = (user, res) => {
  const token = signToken(user._id)

  res.status(201).json({ user, token })
}

const signup = async (req, res) => {
  try {

    const { firstName, lastName, password, email } = req.body
    const userObject = { firstName, lastName, password, email }

    if (!firstName || !lastName || !password) return res.status(400).json('Please provide valid details')
    const existingUser = await User.findOne({ firstName, lastName })
    if (existingUser) return res.json({status: 'fail', message: 'User already exist' })

    const user = await User.create(userObject)

    // login user, send jwt
    createAndSendToken(user, res)
  } catch (err) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user exist
    if (!email || !password) return res.status(400).json({status: 'fail', message: 'Please provide email and password'})
    const foundUser = await User.findOne({ email })
   

    // check if password is correct
    if (!foundUser || !await foundUser.correctPassword(password, foundUser.password)) 
      return res.status(401).json({status: 'fail', message: 'Incorrect login details'})
    

    // login user, send jwt
    createAndSendToken(foundUser, res)
  } catch (err) {
    res.status(500).json({ status: 'fail', message: 'something went wrong' })
  }
}

const isLoggedIn = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       token = req.headers.authorization.split(' ')[1]
    }
    const decoded = await promisify(jwt.verify)(token, jwtSecretKey)
    
    const foundUser = await User.findById(decoded.id)
    if (!foundUser) return res.status(401).json({status: 'fail', message: 'User with that token does not exist'})

    req.user = foundUser
    next()
  } catch (err) {
    if(err.name === 'TokenExpiredError' )return res.status(401).json({ message: 'Please login' })
    if(err.name === 'JsonWebTokenError' )return res.status(401).json({ message: 'Please login' })
    res.status(500).json({ message: 'something went wrong' })
  }
}


module.exports = { signup, login, isLoggedIn}