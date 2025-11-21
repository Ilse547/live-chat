const getQbtn=document.getElementById('getq');
const qlabel=document.getElementById('securityQ');
const respwordBtn=document.getElementById('res-pword');
getQbtn.addEventListener('click', async ()=>{
    const uname=document.getElementById('uname').value.trim();
    if(!uname){alert('enter your username');return;}
    const res=await fetch('/forgot-pword',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username:uname})
    });
    const data=await res.json();
    if(res.ok && data.securityQuestion){
        qlabel.textContent=data.securityQuestion;
    }else{
        qlabel.textContent='';
        alert(data.message||'user not found');
    }
});
respwordBtn.addEventListener('click', async()=>{
    const uname=document.getElementById('uname').value.trim();
    const secAns=document.getElementById('secAns').value.trim();
    const newPword=document.getElementById('newPword').value;
    if(!secAns||!newPword){alert('answe the question and enter new password');return;}
    const res=await fetch('/reset-pword',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username:uname,sA:secAns,newPword:newPword})
    });
    const data=await res.json();
    if(res.ok){alert('password was reset');}else{alert(data.message||'password was not reset');}
})
