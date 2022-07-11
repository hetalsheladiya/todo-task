const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

let userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    usertype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertype'
    }
}, {
    timestamps: true
})

userSchema.methods.getToken = (id) => {    
    let token = jwt.sign({id: id}, process.env.JWT_SECRET_KEY,{expiresIn: '1h'});
    return token;
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel