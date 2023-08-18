const cors=require('cors')
const express=require('express')
const app=express();
const socketiofileupload=require('socketio-file-upload');
app.use(cors({
  origin:"*",
  method:["POST","GET","DELETE","UPDATE"]
  }));
const Sequelize=require('sequelize');
const sequelize=require('./util/database');
const Authentication=require('./Middleware/auth')
const messagedetails=require('./Model/messagedatabase')
const jwt=require('jsonwebtoken')
function generateAccessToken(id ,name,email) {
    return jwt.sign({userid:id,userName:name,UserEmail:email}, '987H5443');
  }
  

const io = require('socket.io')(8000,{
    cors:{
      origin:"*",
  
      method:["POST","GET","DELETE","UPDATE"],
  
    },
  })
const userdetails=require('./Model/userdetails')
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const bcrypt=require('bcrypt')
app.use('/user/login/message/getmessage',async(req,res)=>{
const allMessage=await messagedetails.findAll({
attributes:['message','userdetailId'],
    include:[{
    model:userdetails,
    attributes:['Name','id']
}],
//group:['userdetail.id']
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
  const name=[];

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

         res.status(200).json({message:'User Logged in Successfully',token:generateAccessToken(user[0].id,user[0].Name,user[0].Email)})
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
                    PhoneNumber: req.body.PhoneNumber,
                    socketid:'null',
                    Admin:false


                });
                res.status(200).json({ message: 'Successfully Signed up' });
            }
            catch (error) {
              console.log(error)
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
const usersnamespace={};
// app.use('/user/sendusertoaddinroom',(req,res)=>{
//   console.log(req.body)
//   userstoparticipate.push(req.body.users)
//    //const userselement=userstoparticipate[0].users
  let userIO=io.of("/user/sendusertoaddinroom")
  //const users1=localStorage.getItem('users')
  
  userIO.on("connection", socket => {
    socket.on('newconnection',data=>{
      console.log(data);
      const name=socket.username.userName
      const email=socket.handshake.auth.token.UserEmail
      console.log(socket.handshake.auth.data.users);
      const room=socket.handshake.auth.room;
     // socket.join(room);

      usersnamespace[socket.id]={name,email}

      socket.handshake.auth.data.users.forEach(email1 => {
        if(email1===email)
        {
        console.log(socket);
         socket.join(room);
         socket.to(room).emit('joined',usersnamespace[socket.id].name)
           //console.log(email1);
          //  console.log(room);
          //  console.log(usersnamespace[socket.id].name);
           socket.on('send',message=>{
            console.log(message);
            console.log(usersnamespace)
            socket.to(room).emit('receive',message,usersnamespace[socket.id].name);
            socket.on('disconnect',message=>{
              socket.to(room).emit('left',usersnamespace[socket.id].name,message)
              //delete usersnamespace[socket.id];
            })
        
        })
           
        }
        // else {
        // //delete usersnamespace[socket.id];
        // //   console.log(usersnamespace[socket.id]);

        // }
        
      });
      
      })
      
       
  })
    userIO.use((socket,next)=>{
      
      if(socket.handshake.auth.token){
      // if(socket.handshake.auth.data.users)
      // {
      //   socket.handshake.auth.data.users.forEach(user => {
      //     if(socket.username==user)
      //     {
      //       next();
      //     }
          
      //   });
      // }
      socket.username=getUsernamefromtoken(socket.handshake.auth.token)
        next()
      }else{
        next(new Error('Please send Token'))
      }
    })
    function getUsernamefromtoken(token)
    {
      //console.log(token)
      return token
    }
  //res.status(200).json({message:'Successful'})
//})
// app.use('/user/sendroom',(req,res)=>{
// console.log(req.body)
// })
// app.use('/user/allmail',async(req,res)=>{
//   try{
//       const userdetails =await userdetails.findAll({
      
//   })
//   res.status(200).json({message:'Successful'},userdetails)

// }
// catch(err){
//   res.status(400).json({message:'Something went wrong'})
// }
// })

// function getKeyByValue(object, value) {
//   return Object.keys(object).find(key => object[key] === value);
// }

const users={};
  
io.on('connection', socket => {
  
  socket.on('new-user-joined',(name,email)=>{
    users[socket.id]={name,email}
    userdetails.update({
      socketid:socket.id
    },{where:{
     Email:email
    }})
    //app.use('/admin',(req,res)=>{

    const obj={
      name:name,
      email:email,
      //admin:req.body
    }
    socket.broadcast.emit('user-joined',obj);
  })
  socket.on('multimedia message',data=>{
  socket.broadcast.emit('seemessage',data)
  })
  socket.on('send',(obj)=>{
    console.log(socket);
    socket.broadcast.emit('receive',{message:obj.message,name:users[socket.id].name})

    
      messagedetails.create({
      message:obj.message,
      userdetailId:obj.id
      

    })
   
    
    

  })
  // const userIO=io.of('/user/sendusertoaddinroom')
  // userIO.on("connection",socket=>{
  //   console.log(socket);
  //   console.log("connected to user namespace with username" +socket.username.userName )
  //   // socket.on('new-connection',(name,email)=>{
  //   //   console.log(name,email)
  //   //   console.log(socket);
  //   // })
  //   socket.on('newuserjoined',(name,email)=>{
      
  //     socket.broadcast.emit('user-joined',name);
  //   });
   
  // })
  // userIO.use((socket,next)=>{
  //   if(socket.handshake.auth.token){
  //     socket.username=getUsernamefromtoken(socket.handshake.auth.token)
  //     next()
  //   }else{
  //     next(new Error('Please send Token'))
  //   }
  // })
  // function getUsernamefromtoken(token)
  // {
  //   return token
  // }
  // socket.on('join-room',room=>{
  //   socket.join(room.users2)
  //   console.log(room.users)
  //   console.log(room);
  //   console.log(socket.id);
  // })
  
  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id].name,message)
    delete users[socket.id];
  })


})   
   
userdetails.hasMany(messagedetails);
messagedetails.belongsTo(userdetails);



    userdetails.sync().then(()=>{
     messagedetails.sync().then(()=>{
        app.listen(3000);

     })
})


