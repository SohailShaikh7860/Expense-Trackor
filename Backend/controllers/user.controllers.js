import User from "../model/user.model.js";
import { validationResult } from "express-validator";
import { generateToken, setTokenCookie } from "../utils/jsonAuth.js";

const createUser = async(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return all validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    try {

        const exist = await User.findOne({email});
        if(exist){
            return  res.status(409).json({message:"User already exists"});
        }

        const user = await User.create({name,email,password});
        // await user.save();

        return res.status(201).json({message:"User created successfully", userId:user._id});

    } catch (error) {
        console.log("Error",error);
        
        res.status(500).json({message:"Internal server error"});
    }
}

const loginUser = async(req,res)=>{
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid Password"});
        }

        const payload = {
            email: user.email,
            id: user._id
        }

       const token = generateToken(payload);
        setTokenCookie(res, token);
       console.log(token);
       
     return res.status(200).json({message:"Login successful", userId:user._id});

    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internal server error"});
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(userId).select('-password -verifyOtp -resetOtp -__v');
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user:user.name });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const logOutUser = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',   
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    createUser,
    loginUser,
    getCurrentUser,
    logOutUser
}