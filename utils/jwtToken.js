function sendToken(user, statusCode, res) {    
    let token = user.getToken(user._id)
    res.status(statusCode).cookie('token', token, {maxAge: 60000*60}).json({
        success: true,
        data: user,
        token: token
    })
}

module.exports = sendToken