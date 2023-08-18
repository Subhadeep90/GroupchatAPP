import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
// userdetails.findAll({

// }).then((result)=>{
//   console.log(result)
// }).catch((error)=>{
//   console.log(error)
// });
const token=localStorage.getItem('token')
const room=localStorage.getItem('room')
const data1=localStorage.getItem('users')
const data=JSON.parse(data1)
//const data=JSON.parse(data1)
const decodedtoken=parseJwt(token) 
const usersocket = io("http://localhost:8000/user/sendusertoaddinroom",{auth:{token:decodedtoken,data,room}})

//const admin=decodedtoken.userName;
//const users=localStorage.getItem(users);
  // const data={
  //   users:users,
  //   admin:admin,
  //   users2:users2
  // }
  const append=(name)=>{
    const h5=document.createElement('h5');
    
    h5.append(name)
    document.body.append(h5)
    }

 console.log(data1)
  usersocket.emit('newconnection',data); 
append('You joined')
usersocket.on('joined',data=>{
  append(`${data} joined`)
})
const submitmessage=document.getElementById('send');
submitmessage.onclick=(e)=>{
  const messagedata=document.getElementById('message').value;
   
  e.preventDefault();
  append(`You :${messagedata}`)
  usersocket.emit('send',messagedata)


}

usersocket.on('receive',(message,data)=>{
  append(`${data}:${message}`);
})
usersocket.on('left',data=>{
  append(`${data} left the chat`)
})

// usersocket.on('notjoined',data=>{
//   usersocket.disconnect(data);
//   append(data);
// })
//const userid=decodedtoken.userid
//
//usersocket.emit("connection",decodedtoken.userName,decodedtoken.UserEmail)
// const h5=document.createElement('h5')
// h5.append('You joined')
// document.body.append(h5)
// usersocket.on('user-joined',name=>{
//   console.log(name)
//   append(`${name} joined the chat`)
// })
// const form=document.getElementById('form');
// form.addEventListener("submit",sendmessage)
// function sendmessage(e)
// {
// e.preventDefault();
// const message=document.getElementById('message')
// //const room=document.getElementById('roomvalue')
// //const roomvalue=room.value.split(',');
// // socket.emit('join-room',roomvalue,message=>{
// //   // append(`joined ${message}`)

// //  }
// // )  
// if(message.value==="")return
// else{
//   append(`You:${message.value}`)
//   console.log(userid)
//   let obj={
//     message:message.value,
//     id:userid
//   }
//   usersocket.emit('send',(obj),message=>{
//     append(message)
//   }

//   )
//   message.value='';
// }

// }
// usersocket.on('receive',data=>{
//       append(`${data.name}:${data.message}`)

//   }
// )
// usersocket.on('left',data=>{
//   append(`${data} left the chat`)
// })