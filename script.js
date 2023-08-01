
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



socket.emit('new-user-joined',decodedtoken.userName)
const h5=document.createElement('h5')
h5.append('You joined')
document.body.append(h5)
socket.on('user-joined',name=>{
  console.log(name)
  append(`${name} joined the chat`)
})
const form=document.getElementById('form');
form.addEventListener("submit",sendmessage)
function sendmessage(e)
{
e.preventDefault();
const message=document.getElementById('message')
const room=document.getElementById('roomvalue')
socket.emit('join-room',room.value)

if(message.value==="")return
else{
  append(`You:${message.value}`)
  socket.emit('send',message.value,room.value)
  message.value='';
}

}
socket.on('receive',data=>{
      append(`${data.name}:${data.message}`)

  }
)
socket.on('left',data=>{
  append(`${data} left the chat`)
})
// const CreateGroup=document.getElementById('CreateGroup');
// CreateGroup.addEventListener('click',designGroup)
// function designGroup()
// {
//   const container=document.getElementById('container');
//   const form=document.createElement('form');
//   const input=document.createElement('input');
//   input.type="text"
//   input.id="Room"

//   const button=document.createElement('button');
//   button.innerText="Enter"
//   button.id="roomsubmit"
//   form.append(input,button)

//   container.appendChild(form);
//   const roomtosubmit=document.getElementById('roomsubmit');
//   roomtosubmit.addEventListener('click',EnterRoom)
// }

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
