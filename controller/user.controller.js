const bcryptjs  = require('bcryptjs')
const userModel = require("../models/user.model");
const UserTypeModel = require("./../models/usertype.model")
const ErrorHandler = require("../utils/ErrorHandler");
const { validationResult } = require("express-validator");
const sendToken = require('../utils/jwtToken');

module.exports = {    
    register: async(req, res, next) => {
        try {
            const error = validationResult(req);            
            if(!error.isEmpty()) {
                return res.status(400).json({success: false, error: error.errors})
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
                res.status(400).json({success: false, error: error.errors})
            }
            else {
                let {email, password } = req.body;                
                let regex = new RegExp(['^',email,'$'].join(""),"i");
                let user = await userModel.findOne({email: regex}).select("password");                    
                if(user && await bcryptjs.compare(password, user.password)) 
                    sendToken(user, 200, res)                
                else 
                    res.status(400).json({success: false, error: "Invalid Credentials"})               
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
                res.status(400).json({success: false, error: error.errors})
            }
            else {
                const { userId } = req.query;                
                res.status(200).json({
                    success: true,
                    message: `User successfully deleted`
                })
            }
        }
        catch(e) {
            next(e)
        }
    }
}