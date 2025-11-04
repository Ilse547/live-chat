const gun = GUN(['https://lich-z34n.onrender.com']);
const chat = gun.get('general-chat');
let username = null;

// DOM elements
const usernameInput = document.getElementById('username-input');
const setUsernameBtn = document.getElementById('set-username-btn');
const currentUserDiv = document.getElementById('current-user');
const currentUsernameSpan = document.getElementById('current-username');
const logoutbtn = document.getElementById('logout-btn');


async function checkauth() {
    try{
        const response = await fetch('/api/me');
        const data = await response.json();
        if(!data.authenticated){
            window.location.href ='/login.html';
            return null;
        }
        username = data.username;
        currentUsernameSpan.textContent=username;
        document.getElementById('current-user').classList.remove('hidden');
        return data;
    }catch(err){console.error('auth check failed:',err);window.location.href='/login.html';return null;}
};
logoutbtn.addEventListener('click', async()=>{
    try{
        await fetch('/logout', {method:"POST"});
        window.location.href='/login.html';
    }catch(err){console.error("logout failed:",err);window.location.href='/login.html'}});
document.getElementById('send-btn').addEventListener("click",()=>{
    const input=document.getElementById('message-input');
    if(input.value.trim()&&username){
        const message = {
            text:input.value.trim(),
            user:username,
            timestamp:Date.now(),
            id:'msg_'+username+'_'+Date.now()
        };
        chat.get('messages').get(message.id).put(message);
        input.value = "";
    }else if(!username){alert('wait until username load');}});

document.getElementById('message-input').addEventListener('keypress', (e)=>{
    if(e.key==="Enter"){document.getElementById('send-btn').click();}});
chat.get('messages').map().on((message,key)=>{
    if(message&&message.text&&message.user&&message.id){
        if(!document.getElementById(message.id)){displayMessage(message);}}})
function displayMessage(message){
    const messageDiv=document.getElementById('messages');
    const messagesEl=document.createElement('div');
    messagesEl.id=message.id;
    messagesEl.className='message';
    if(message.user === username){messagesEl.classList.add('own-message');}
    messagesEl.innerHTML=`<strong>${message.user}:</strong>${message.text}
    <small>${new Date(message.timestamp).toLocaleTimeString()}</small>`;
    messageDiv.appendChild(messagesEl);
    messageDiv.scrollTop=messageDiv.scrollHeight;
}
document.addEventListener('DOMContentLoaded', checkauth);
