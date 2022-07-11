const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const userModel = require("../models/user.model");

const isAuthorized = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if(!authorization || Object.keys(authorization).length === 0) {
            return next(new ErrorHandler(`Please login to access this resource`, 401))
        }
        let token = req.headers.authorization.split("Bearer ")[1]; 
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);        
        req.user = await userModel.findById(decoded.id).populate('usertype')                
        next();
    }   
    catch(e) {        
        next(new ErrorHandler(e.message, 401))
    }    
}

const isAdminAuthorized = async (req, res, next) => {
    const { usertype } = req.user
    if(usertype.usertype !== 'admin') {
        return next(new ErrorHandler(`You have no permission to access this resource`))
    }
    next()
}

module.exports = {
    isAuthorized,
    isAdminAuthorized
}