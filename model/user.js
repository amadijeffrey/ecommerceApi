const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '$VALUE is not a valid email',
            isAsync: false
        }
    },
    password: String,
    
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem'
        }
    ],
    ref: Number

})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
  })
  
  
userSchema.methods.correctPassword = async(candidatePassword, userPassword) => {
return await bcrypt.compare(candidatePassword, userPassword)
 
}

const User = mongoose.model('User', userSchema)
module.exports = User