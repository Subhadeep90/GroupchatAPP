const { json } = require('sequelize');
const userdetails=require('../Model/userdetails');

const jwt=require('jsonwebtoken')

const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authentication')
        const user=jwt.verify(token,'987H5443')
        userdetails.findByPk(user.userid).then((user)=>{
        console.log(JSON.stringify(user));
        req.user=user;
        next();

    }).catch((error)=>{
        throw new Error(error)
    })
        
    }

catch(error)
{
 console.log(error)
 return res.status(401).json({success:false})
}
}
module.exports=authenticate