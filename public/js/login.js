document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const uname=document.getElementById('uname').value;
    const pword=document.getElementById('pword').value;
    if(!validateUsername(uname)){
      alert('username must be between 3 and 20 character slogn');
      return;
    }
    if(!validatePassword(pword)){
      alert('pword must eb at elast 6 characters long');
      return;
    }
    await login(uname, pword);});});
async function login(uname, pword) {
  const response=await fetch('/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({uname,pword})
  });
  const data=await response.json();
  if(data.token){
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('admin', data.admin);
    localStorage.setItem('userId', data.id);
    window.location.href='/';
  }else{alert(data.message||'login did not work');}
}