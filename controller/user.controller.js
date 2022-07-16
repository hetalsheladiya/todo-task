const bcryptjs  = require('bcryptjs')
const userModel = require("../models/user.model");
const UserTypeModel = require("./../models/usertype.model")
const ErrorHandler = require("../utils/ErrorHandler");
const { validationResult } = require("express-validator");
const sendToken = require('../utils/jwtToken');
const userService = require("./../utils/UserService")

module.exports = {    
    register: async(req, res, next) => {
        try {
            const error = validationResult(req);            
            if(!error.isEmpty()) {
                return res.status(400).json({success: false, errors: error.errors})
            }
            else {
                const {username, email, password, usertype } = req.body;                     
                encryptedPassword = await bcryptjs.hash(password, 10)          
                const user = await userModel.create({
                    username,
                    email: email.toLowerCase(),
                    password: encryptedPassword,
                    usertype
                }); 
                if(!user) {
                    throw new ErrorHandler(`Failed! Error occured while registration`, 400)
                }                
                sendToken(user, 201, res)                                
            }  
        }
        catch(e) {
            next(e)
        }
    },
    login: async (req, res, next) => {
        try {
            const error = validationResult(req);            
            if(!error.isEmpty()) {
                return res.status(400).json({success: false, errors: error.errors})
            }
            else {
                let {email, password } = req.body;                
                let regex = new RegExp(['^',email,'$'].join(""),"i");
                let user = await userModel.findOne({email: regex}).select("username password").populate('usertype','usertype');                    
                if(user && await bcryptjs.compare(password, user.password)) {
                    user.password = undefined;
                    delete user.password;
                    sendToken(user, 200, res)  
                }              
                else 
                    return res.status(400).json({success: false, errors: "Invalid Credentials"})               
            }
        }
        catch(e) {
            next(e)
        }
    },
    logout: async (req, res) => {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        res.json({
            success: true,
            message: `Logged out`
        })
    },
    deleteUser: async(req, res, next) => {
        try {            
            const error = validationResult(req);           
            if(!error.isEmpty()) {
                return res.status(400).json({success: false, errors: error.errors})
            }
            else {
                const { userId } = req.params;    
                const data = await userService.deleteUser(userId);
                if(data)                
                    return res.status(200).json({
                        success: true,
                        message: `User successfully deleted`
                    })
                else 
                    throw new ErrorHandler('Faile! Error occured while deleeting user', 400)
            }
        }
        catch(e) {
            next(e)
        }
    },
    userList: async(req, res, next) => {
        try {            
            const error = validationResult(req);           
            if(!error.isEmpty()) {
                return res.status(400).json({success: false, errors: error.errors})
            }
            const { _id } = req.user;
            const data = await userService.listOfUser(_id);
            return res.status(200).json({
                success: true,
                data: data
            })
        }
        catch(e) {
            next(e)
        }
    }
}