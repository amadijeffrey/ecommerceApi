const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../model/user')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
  httpOnly: true
}

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

const createAndSendToken = (user, res) => {
  const token = signToken(user._id)
  res.cookie('jwt', token, cookieOptions)

  res.status(201).json({ user, token })
}

const signup = async (req, res) => {
  try {

    const { firstName, lastName, password, email } = req.body
    const userObject = { firstName, lastName, password, email }

    if (!firstName || !firstName || !password) return res.status(400).json('Please provide valid details')
    const existingUser = await User.findOne({ firstName, lastName })
    if (existingUser) return res.json({ message: 'User already exist' })

    const user = await User.create(userObject)

    // login user, send jwt
    createAndSendToken(user, res)
  } catch (err) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // check if user exist
    if (!email || !password) return res.status(400).json({message: 'Please provide email and password'})
    const foundUser = await User.findOne({ email })

    // check if password is correct
    if (!foundUser || !await foundUser.correctPassword(password, foundUser.password)) 
      return res.status(401).json({message: 'Incorrect login details'})
    

    // login user, send jwt
    createAndSendToken(foundUser, res)
  } catch (err) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

const protect = async (req, res, next) => {
  try {
    let token
    if (req.header.authorization && req.header.authorization.startsWith('Bearer')) {
      token = req.header.authorization.split(' ')[1]
    }
    else if (req.cookies.jwt){
      token = req.cookies.jwt
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    if (!decoded) return res.status(401).json({message: 'You are not logged in. Try again after you log in'})

    const foundUser = await User.findById(decoded.id)
    if (!foundUser) return res.status(401).json({message: 'User with that token does not exist'})

    req.user = foundUser
    next()
  } catch (err) {
    res.status(500).json({ message: 'something went wrong' })
  }
}


module.exports = { signup, login, protect }