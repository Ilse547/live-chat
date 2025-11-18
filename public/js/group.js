const params=new URLSearchParams(window.location.search);
const gid=params.get("gid");
const gun = GUN([
    'https://lich-z34n.onrender.com/gun',
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun']);
const chat = gun.get(`group-chat-${gid}`);
let username = null;

const currentUserDiv = document.getElementById('current-user');
const currentUsernameSpan = document.getElementById('current-username');
const logoutbtn = document.getElementById('logout-btn');
const cchat = document.getElementById('create-chat');


document.getElementById("sb-btn").addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
});

document.addEventListener('DOMContentLoaded', ()=>{
    checkauth();
    const delmsg=document.getElementById('dlt-msg');
    delmsg.addEventListener('click', delallmsg);
});
async function delallmsg(){
    try{
        const token=localStorage.getItem('token');
        const response=await fetch("/api/me",{
            headers:{
                'Authorization':'Bearer '+token
            }
        });
        const data = await response.json();
        if(!data.admin){alert('access denied you are not and admin :(');return;}
        const condel = confirm('this will delete all msgs, are you sure ?');
        if(!condel) return;
        console.log('admin del msg');
        chat.get('messages').map().on((message, key)=>{
            if(message && key){chat.get('messages').get(key).put(null);}
        });
        chat.get('messages').put(null);
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML='';
        alert('messages were deleted');
        console.log("messages deleted");

    }catch(err){console.error('errirr del messages:', err); alert("error del emssages");}
}
logoutbtn.addEventListener("click",()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('admin');
    localStorage.removeItem('userId');
    window.location.href="/login.html";
});
async function checkauth() {
    console.log("running checkauth");
    try{
        const token=localStorage.getItem('token');
        if(!token){
            window.location.href ='/login.html';
            return null;
        }
        const response=await fetch("/api/me",{
            headers:{
                'Authorization':'Bearer '+token
            }
        });
        const data=await response.json();
        if(!data.authenticated){
            window.location.href='/login.html';
            return null;
        }

        username = data.username;
        currentUsernameSpan.textContent=username;
        document.getElementById('current-user').classList.remove('hidden');
        if(data.admin){
            showAdminElement();
        }else{hideAdminElement();
        }


        return data;
    }catch(err){console.error('auth check failed:',err);window.location.href='/login.html';return null;}
};
function showAdminElement(){
    const adminElement = document.querySelectorAll('.adminonly');
    adminElement.forEach(Element=>{
        Element.classList.remove('hidden');
    });
}

function hideAdminElement(){
    const adminElement = document.querySelectorAll('.adminonly');
    adminElement.forEach(Element=>{
        Element.classList.add('hidden');
    });
}

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

cchat.addEventListener('click', async()=>{
    try {
        window.location.href='/create.html';
    }catch(err){console.error(err); resizeBy.status(404).json({message:"eroror"});}})
async function loadusrgrps(){
    const token=localStorage.getItem('token');
    if(!token) return;
    const res=await fetch('/api/groups', {headers:{'Authorization': 'Bearer '+token}});
    const data=await res.json();
    if(data.success){
        const groupDiv=document.getElementById('usr-grps');
        groupDiv.innerHTML='<h4>Groups:</h4>';
        data.groups.forEach(group=>{
            const groupBtn=document.createElement('button');
            groupBtn.className='group-btn sbtn';
            groupBtn.textContent=group.Gname;
            groupBtn.addEventListener('click',()=>{
                window.location.href=`/chat.html?gid=${group.Gid}`;
            });
            groupDiv.appendChild(groupBtn);
        });
    }
}

const mbtn=getElementById('mbtn');
mbtn.addEventListener('click',()=>{
    window.location.href="/";
});
document.addEventListener('DOMContentLoaded', async ()=>{
    await checkauth();
    await loadusrgrps();
});

//document.body.insertAdjacentHTML('beforeend',`<p>Group id: ${gid}</p>`);
