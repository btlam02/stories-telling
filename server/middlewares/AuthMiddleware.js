const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const MiddleWareController = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.token; 
        if (!authHeader) {
            return res.status(401).json("Not Authenticated");
        }
        const token = authHeader.split(" ")[1]; 
        jwt.verify(token, process.env.JWT_SECRET_ACCESS, (error, user) => {
            if (error) {
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
        });
    },


    verifyTokenAdminAuth: (req, res, next) =>{
        MiddleWareController.verifyToken(req, res,() =>{
            if(req.user.id == req.params.id && req.user.role == 'admin'){
                next(); 
            }
            else {
                res.status(403).json("Not Allowed")
            }
        });
    }
};


module.exports = MiddleWareController;