const express = require('express');
const userRouter = express.Router();
const { check } = require('express-validator');
const { register, login, logout, deleteUser, userList } = require('../controller/user.controller');
const { isAuthorized, isAdminAuthorized } = require('../middleware/auth');
const UserService = require("../utils/UserService")

userRouter.route("/register").post([
    check("username").trim()
    .not().isEmpty().withMessage(`Username can not ne null`),
    check("email").trim()    
    .not().isEmpty().withMessage(`Email can not be null`)
    .bail()
    .isEmail().withMessage(`Not an E-mail`)
    .custom(async(email) => {
        let user = await UserService.findUserByEmail(email);
        
        if(user){
            throw new Error(`E-mail already in use`)
        }
    }),
    check("password").not().isEmpty().withMessage(`Password can not be null`)
                    .bail()
                    .isLength({min: 8}).withMessage(`Must be at least 8 chars long`),
    check("usertype").trim().not().isEmpty().withMessage(`Please select user type`),
], register);

userRouter.route("/login").post([
    check("email").trim().not().isEmpty().isEmail()
    .withMessage(`Email can not be null`)
    .custom(async(email) => {
        let user = await UserService.findUserByEmail(email);
        if(!user) 
            throw new Error(`Email not found`)
    }),
    check("password").not().isEmpty().withMessage(`Password can not be null`)
], login)

userRouter.route("/logout").get(logout)

userRouter.route("/user-delete/:userId").delete(isAuthorized, isAdminAuthorized, [
    check('userId').not().isEmpty().withMessage(`Please provide user id`)
], deleteUser)

userRouter.route("/user-list").get(isAuthorized, isAdminAuthorized, userList)

module.exports = userRouter