const params=new URLSearchParams(window.location.search);
const gid=params.get("gid");
document.body.insertAdjacentHTML('beforeend',`<p>Group id: ${gid}</p>`);
