import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

export const register=async(req,res)=>{

    try {
        const {username,email,password}=req.body;

    //hash the password
    const hashedPassword= await bcrypt.hash(password,10);

    //create a new user
    const newUser=await prisma.user.create({
        data:{
            username,
            email,
            password:hashedPassword
        },
    });
    // console.log(newUser);

    return res.status(200).json({
        message:"User registered successfully",
        data:newUser,
        success:true,
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,
            error:error
        })
    }
    
} 

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        //Check if user exists
        const user=await prisma.user.findUnique({
            where:{email:email}
        });

        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }

        //check if password is correct
        const isPasswordValid=bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message:"Password is not correct"
            })
        }

        //Generate COOKIE Token and send to the user
        const age=1000*60*60*24*7;          //session expire kab hoga

        const token=jwt.sign({
            id:user.id,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn:age}
    )
        res.cookie("token",token,{
            httpOnly:true,
            // secure:true,         kyunki https nhi use kar rhe hai
            maxAge:age
        }).status(200).json({
            message:"Login is successfull",
            success:true,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
    
} 

export const logout=async(req,res)=>{
    //when you logout you have to clear cookie
    res.clearCookie("token").status(200).json({
        message:"Logout is successfull",
        success:true
    })
} 