const User = require('../models/model.user');
const Token = require('../models/model.token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errorMsg = {
    success: false,
    message: "Email or Password is missing",
    error: "Please provide valid email and password"
}

exports.attemptLogin = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(401).json(errorMsg);

        const user = await User.findOne({'email': email});
        if(!user) return res.status(401).json(errorMsg);

        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword){
            const accessToken = generateAccessToken(generatePayload(user));
            const refreshToken = generateRefreshToken(generatePayload(user));
            try{
                await Token.create({'token': refreshToken, 'user_id': user._id});
                res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
                res.status(200).json({
                    success: true,
                    message: "Login Successful",
                    data: {
                        user: user,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                });    
            }catch(err){
                return res.status(401).json({...errorMsg, message: "Something went wrong!"});
            }
        }else{
            return res.status(401).json(errorMsg);
        }
    }catch(err)
    {
        return res.status(500).json({
            ...errorMsg, 
            message: err.message || "Some error occurred while attempting the login!"
        });
    }
};

exports.getNewAccessToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    // const refreshToken = req.cookies.refreshToken;

    if(refreshToken == null) return res.status(401).json(
        {
            message: 'Refresh Token Not Found'
        }
    );
    try{
        const token = await Token.findOne({'token': refreshToken});
        if(!token) return res.status(401).json({
            success: false,
            message: 'Refresh token not found',
            error: 'Invalid refresh token'
        });
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json({
                success: false,
                message: 'Refresh token expired',
                error: 'Invalid refresh token'
            });
            if(user.sub != token.user_id) return res.status(403).json({
                success: false,
                message: 'Invalid refresh token',
                error: 'Invalid refresh token'
            });
            const accessToken = generateAccessToken(generatePayload(user));
            return res.json({
                success: true,
                message: "Access token created",
                data: {
                    accessToken: accessToken
                }
            });
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message:"Some error occurred while attempting the login",
            error: err.message
        });
    }
}

function generatePayload(user)
{
    return {
        sub: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000) - 30
    }
}

function generateAccessToken(payload) {
    // expires after 15-30 min (9000 seconds = 15 minutes)
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
}

function generateRefreshToken(payload) {
    // expires after 1 day
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
}

// require('crypto').randomBytes(64).toString('hex');