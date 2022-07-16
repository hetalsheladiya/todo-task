const userModel = require("../models/user.model");
const UserTypeModel = require("../models/usertype.model");

const findUserByEmail = async(email) => {
    const user = await userModel.findOne({email: regexString(email)}).select('email')
    return user;
}

const findUserType = async(userType) => {
    const checkUserType = await UserTypeModel.findOne({usertype: regexString(userType)})
    return checkUserType;
}

function regexString (email) {
    return new RegExp(["^", email, "$"].join(""),"i");
}

const deleteUser = async(userId) => {
    const data = await userModel.findByIdAndRemove(userId);
    return data;
}

const listOfUser = async(adminId) => {
    const userTypes = await UserTypeModel.find({usertype : { $nin: ['admin','Admin']}});
    const usertype = userTypes.map(item => {
        return item.usertype
    })    
    const data = await userModel.aggregate([
        {
            $match: {
                _id: {$ne: adminId}
            }
        }, {
            $lookup: {
                from: 'usertypes',
                localField: 'usertype',
                foreignField: "_id",
                as: "usertype"
            }
        }, {
            $unwind: "$usertype"
        }, {
            $match: {
                "usertype.usertype": {
                    $in: usertype
                }
            }
        }
    ])
    return data;
}

module.exports = {
    findUserByEmail,
    findUserType,
    deleteUser,
    listOfUser
}