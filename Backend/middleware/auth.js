import jwt from 'jsonwebtoken';

const authToken = (req,res,next)=>{
    const token = req?.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification error:",error.message);
        res.status(401).json({message:"Invalid or expired token"});
    }
}

export {
    authToken
}