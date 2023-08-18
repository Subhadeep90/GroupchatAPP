
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
//import { io } from "socket.io-client"
const socket = io("http://localhost:8000")

function parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
  }
  const token=localStorage.getItem('token')
const decodedtoken=parseJwt(token) 
const append=(name)=>{
const h5=document.createElement('h5');

h5.append(name)
document.body.append(h5)
}
const addAdmin=document.getElementById('AddAdmin');
addAdmin.onclick=(e)=>{
  e.preventDefault();
  const alladminemail=document.getElementById('admin').value
  const alladmin=alladminemail.split(',')
  // alladmin.forEach(email => {
  //   if(email!=decodedtoken.UserEmail)
  //   {
  //     console.log(email)
  //   }

  // })
  axios.post("http://localhost:3000/admin",alladmin).then((result)=>{
    console.log(result)
  }).catch((err)=>{
    console.log(err)
  });
  //localStorage.setItem('admin',alladmin)
}

// const upload=document.getElementById('upload');
// upload.onclick=(e)=>{
// e.preventDefault();
// axios.post("http://localhost:3000/user/documentupload").then((result)=>{
//   console.log(result)
// }).catch((error)=>{
//   console.log(error)
// })
// }

const userid=decodedtoken.userid
socket.emit('new-user-joined',decodedtoken.userName,decodedtoken.UserEmail)
const h5=document.createElement('h5')
h5.append('You joined')
document.body.append(h5)
//localStorage.getItem('admin',alladmin);

socket.on('user-joined',obj=>{
  //allemail.push(obj.email);
//localStorage.setItem('email',allemail)
append(`${obj.name} joined the chat`)
  
  
})
const form=document.getElementById('form');
form.addEventListener("submit",sendmessage)
function sendmessage(e)
{
e.preventDefault();
const message=document.getElementById('message')
const fileInput=document.getElementById('upload')
console.log(fileInput)
const reader=new FileReader()
const file=fileInput.files[0];
console.log(file);
if(file){
  reader.readAsDataURL(file)
  reader.onload=()=>{
    console.log(reader);
    const img=document.createElement('img')
     img.src=reader.result
     img.width="100"
     img.height="100"
     
    append('You :')
    append(img)

    
    socket.emit('multimedia message',{
      user:decodedtoken.userName,
      image:reader.result
    })
    fileInput.value="";

    }
  }

//const room=document.getElementById('roomvalue')
//const roomvalue=room.value.split(',');
// socket.emit('join-room',roomvalue,message=>{
//   // append(`joined ${message}`)

//  }
// )  
if(message.value==="")return
else{
  append(`You:${message.value}`)
  console.log(userid)
  let obj={
    message:message.value,
    id:userid
  }
  socket.emit('send',(obj),message=>{
    console.log(message)
    append(message)
  }

  )
  message.value='';
}

}
socket.on('receive',data=>{
      append(`${data.name}:${data.message}`)

  }
)
socket.on('seemessage',data=>{
const img=document.createElement('img')
img.src=data.image
img.width="100"
img.height="100"

append(`${data.user}:`);
append(img);
})

socket.on('left',data=>{
  append(`${data} left the chat`)
})

window.addEventListener('DOMContentLoaded',showonscreenmessage)
function showonscreenmessage()
{
  axios.get('http://localhost:3000/user/login/message/getmessage').then((result)=>{
    const data=result.data.allMessage
    data.forEach(element => {
      let Name=element.userdetail.Name;
      let message=element.message;
        append(`${Name}:${message}`)
      })
    })
  .catch((error)=>{
    console.log(error)
  })
}
const CreateGroup=document.getElementById('CreateGroup')
CreateGroup.addEventListener('click',designGroup)
function designGroup()
{
  const container=document.getElementById('container')
    
  const input=document.createElement('input');
  input.type="text";
  input.id="user"
  
  
  const button=document.createElement('button')
  button.innerText="Add Members"
  button.id="AddMembers"
  

button.onclick=(e)=>{
  e.preventDefault();
  const users1=document.getElementById('user').value
  //const users2=document.getElementById('members').value

  const users={users:users1.split(',')}
  const usersstringified=JSON.stringify(users)
  localStorage.setItem('users',usersstringified)
  const admin=decodedtoken.userName;
  // const data={
  //   users:users,
  //   admin:admin,
  // }
  //localStorage.setItem('data',users)
//   axios.post("http://localhost:3000/user/sendusertoaddinroom",data).then((result)=>{
//     console.log(result)

//     //window.location.href="http://127.0.0.1:5500/Views/roomsjoined.html"
//     })
//   .catch(error=>{
//     console.log(error)
//   })
 }

container.append(input,button)
}
const JoinRoom =document.getElementById('JoinRoom');

JoinRoom.onclick=(e)=>{
  e.preventDefault();
  const roomvalue =document.getElementById('roomvalue').value;
   localStorage.setItem('room',roomvalue);
//   axios.post("http://localhost:3000/user/sendroom",{roomvalue:{roomvalue}}).then((result)=>{
//     console.log(result)
//   }).catch((err)=>{
//   console.log(err)
// })
window.open('http://127.0.0.1:5500/Views/roomsjoined.html','_blank');

}



  //const container=document.getElementById('container');
  // const form=document.createElement('form');
  // const input=document.createElement('input');
  // input.type="text"
  // input.id="Room"

  // const button=document.createElement('button');
  // button.innerText="Enter"
  // button.id="roomsubmit"
  // form.append(input,button)

  // container.appendChild(form);
  // const roomtosubmit=document.getElementById('roomsubmit');
  // roomtosubmit.addEventListener('click',EnterRoom)
//}

// function EnterRoom()
// {
// const Room=document.getElementById('Room');
// const RoomInPut=Room.value;
// socket.emit('join-room',RoomInPut)
// }

// const obj={
//     message:document.getElementById('message').value
// }
//  axios.post("http://localhost:3000/user/login/message",obj,{headers:{"Authentication":token}}).then((result)=>{
//      console.log(result)
//  }).catch((err)=>{ 
//      console.log(err)
//  })
//}
// const button=document.getElementById('send-button')
// console.log(button)

// button.addEventListener('click',submit)
// function submit(e)
// {
//   const message=document.getElementById('message-input').value

// e.preventDefault()

//   socket.emit('custom-event',message)


// }

// const messageContainer = document.getElementById('message-container')
// const messageForm = document.getElementById('send-container')
// const messageInput = document.getElementById('message-input')

// const name = prompt('What is your name?')
// appendMessage('You joined')
// socket.emit('new-user',name)

// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`)
// })

// socket.on('user-connected', name => {
//   appendMessage(`${name} connected`)
// })

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`)
// })

// messageForm.addEventListener('submit', e => {
//   e.preventDefault()
//   const message = messageInput.value
//   appendMessage(`You: ${message}`)
//   socket.emit('send-chat-message', message)
//   messageInput.value = ''
// })

// function appendMessage(message) {
//   const messageElement = document.createElement('div')
//   messageElement.innerText = message
//   messageContainer.append(messageElement)
// }
