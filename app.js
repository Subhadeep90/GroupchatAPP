const cors=require('cors')
const express=require('express')
const app=express();
const Authentication=require('./Middleware/auth')
const messagedetails=require('./Model/messagedatabase')
const jwt=require('jsonwebtoken')
function generateAccessToken(id ,name) {
    return jwt.sign({userid:id,userName:name}, '987H5443');
  }
  
app.use(cors({
origin:"*",
method:["POST","GET","DELETE","UPDATE"]
}));
const userdetails=require('./Model/userdetails')
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const bcrypt=require('bcrypt')
app.use('/user/login/message/getmessage',async(req,res)=>{
const allMessage=await messagedetails.findAll({
})
res.status(200).json({message:'Successful',allMessage})
})
app.use('/user/login/message',Authentication,async(req,res)=>{
    const message=req.body.message;
    try{
        await messagedetails.create({
        message:message,
        userdetailId:req.user.id
    })
    res.status(200).json({message:'Successful'})
}
catch(err){
    res.status(400).json({message:'Something went wrong'})
}
  })
app.use('/user/login',async(req,res)=>{
if(req.body.Email=="" || req.body.Password=="")
{
    return res.status(504).json({message:'Email or Password is missing'})
}
try{
    const user=await userdetails.findAll({
    where:{
        Email:req.body.Email
    }
})
try{

if(user.length>0)
{
  const Password=req.body.Password
  const encryptedPassword=user[0].dataValues.Password;
  await bcrypt.compare(Password,encryptedPassword,(err,success)=>{
      if(err)
      {
          console.log(err)
      }
      if(success)
      {
         res.status(200).json({message:'User Logged in Successfully',token:generateAccessToken(user[0].id,user[0].Name)})

      }
      else{
        res.status(405).json({message:'Wrong Password'})

      }
  })
  }
else{
    res.status(500).json({message:'User does not Exist,Please SignUp'})
}
}
  catch(error){
       res.status(502).json({message:'Something went wrong'})
  }

}
catch(error){
    res.status(400).json({message:'Something went wrong'})
}
})
app.use('/user/SignUp',async(req,res)=>{
try{
if(req.body.Name=="" || req.body.Email=="" || req.body.PhoneNumber=="" ||req.body.Password=="" )
{
    res.status(400).json({message:'Name or Email or PhoneNumber or Password is missing'})
}
else{

        const Passwordtaken=req.body.Password;
        const saltrounds=10;
        const hash =await bcrypt.hash(Passwordtaken,saltrounds)

            try {
                await userdetails.create({
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Password: hash,
                    PhoneNumber: req.body.PhoneNumber
                });
                res.status(200).json({ message: 'Successfully Signed up' });
            }
            catch (error) {
                res.status(405).json({ message: "User Already Exists,Please Login" });

            }
        }
        


    }
    catch(error){
        console.log(error)
        res.status(505).json({message:"Something went wrong"})
    }
    }
    
)
userdetails.hasMany(messagedetails);
messagedetails.belongsTo(userdetails)

    userdetails.sync().then(()=>{
     messagedetails.sync().then(()=>{
        app.listen(3000);

     })
})


