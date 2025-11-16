document.getElementById('create-chatf').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const usernames = document.getElementById('unames').value.split(',').map(s=>s.trim());
    const token=localStorage.getItem('token');
    const res=await fetch('/api/create-chat',{
        method:'POST',
        headers:{'Content-type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({unames:usernames})
    });
    const data=await res.json();
    if(data.success){
        window.location.href=`/chat.html?gid=${data.group.Gid}`;
    }else{alert('failed to create chart');}})