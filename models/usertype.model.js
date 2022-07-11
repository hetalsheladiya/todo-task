const mongoose = require("mongoose");

const userTypeSchema = mongoose.Schema({
    usertype: String
},{
    timestamps: true
})

const UserTypeModel = mongoose.model('usertype', userTypeSchema)

module.exports = UserTypeModel