const jwt=require('jsonwebtoken');
const JWT_KEY=process.env.JWT_KEY;
const verifyToken = (req, res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_KEY, (err, decoded)=>{
            if(err){return res.status(403).json({message:'invalid token'});
        } else{req.user = decoded;
                next();
            }});}else{res.status(403).json ({message:"token not provided"});}}
module.exports=verifyToken
