const userModel = require("../models/user.model");
const UserTypeModel = require("../models/usertype.model");

const findUserByEmail = async(email) => {
    let user = await userModel.findOne({email: regexString(email)}).select('email')
    return user;
}

const findUserType = async(userType) => {
    let checkUserType = await UserTypeModel.findOne({usertype: regexString(userType)})
    return checkUserType;
}

function regexString (email) {
    return new RegExp(["^", email, "$"].join(""),"i");
}

module.exports = {
    findUserByEmail,
    findUserType
}