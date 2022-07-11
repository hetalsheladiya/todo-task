const { validationResult } = require("express-validator");
const UserTypeModel = require("../models/usertype.model");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = {
    addUserType: async(req, res, next) => {
        try {
            let error = validationResult(req);
            if(!error.isEmpty()) {
                res.status(400).json({success: false, error: error.errors})
            }
            else {
                let { usertype } = req.body;
                const data = await UserTypeModel.create({usertype: usertype.toLowerCase()}); 
                if(!data) {
                    throw new ErrorHandler(`Failed! Error occured while user type creation`, 400)
                }
                res.status(201).json({
                    success: true,
                    data: data,
                    message: `User type created.`
                })
            }
        }
        catch(e) {
            next(e)
        }
    },
    listOfAllUserType: async(req, res, next) => {
        try {
            let data = await UserTypeModel.find().select('usertype');
            res.status(200).json({
                success: true,
                data: data
            })
        }
        catch(e) {
            next(e)
        }
    }
}