const express = require("express");
const userTypeRoute = express.Router();
const { body } = require("express-validator");
const UserService = require("./../utils/UserService");
const { addUserType, listOfAllUserType} = require("./../controller/usertype.controller")

userTypeRoute.route("/add-usertype").post([
    body("usertype").trim().not().isEmpty().withMessage(`Usertype can not be null`)
    .custom(async (usertype) => {
    let userType = await UserService.findUserType(usertype)
        if(userType) {
            throw new Error(`User type already exist.`)
        }
    })
],
addUserType);

userTypeRoute.route("/usertype-list").get(listOfAllUserType)

module.exports = userTypeRoute