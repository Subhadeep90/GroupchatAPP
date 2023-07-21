const cors=require('cors')
const express=require('express')
const app=express()
app.use(cors());
const userdetails=require('./Model/userdetails')
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const bcrypt=require('bcrypt')

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

    userdetails.sync().then(()=>{
    app.listen(3000);
})


