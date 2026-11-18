const demoChats = [
 {id:1,name:"Ayesha Khan",initial:"A",preview:"This is the beginning of something great ✨",time:"10:26",color:"teal"},
 {id:2,name:"Usman Ali",initial:"U",preview:"Sent you a photo",time:"Yesterday",color:"blue"},
 {id:3,name:"Sara Ahmed",initial:"S",preview:"Are we still meeting today?",time:"Mon",color:"pink"},
 {id:4,name:"Hamza Raza",initial:"H",preview:"Voice message",time:"Sun",color:"gold"}
];
let activeId=1;
const $=s=>document.querySelector(s);
const toast=(msg)=>{const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)};
function renderChats(filter=""){
 const list=demoChats.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase()));
 $("#chatList").innerHTML=list.slice(0,4).map(c=>`<button class="nav-item" data-chat="${c.id}">● <span>${c.name}</span></button>`).join("");
 $("#conversationCards").innerHTML=list.map(c=>`<button class="conversation-card ${c.id===activeId?"selected":""}" data-chat="${c.id}"><div class="avatar">${c.initial}</div><div class="meta"><b>${c.name}</b><p>${c.preview}</p></div><time>${c.time}</time></button>`).join("") || '<p class="muted" style="padding:18px">No conversations found.</p>';
 document.querySelectorAll("[data-chat]").forEach(b=>b.addEventListener("click",()=>selectChat(Number(b.dataset.chat))));
}
function selectChat(id){
 activeId=id;const c=demoChats.find(x=>x.id===id);if(!c)return;
 $("#activeName").textContent=c.name;$("#activeAvatar").textContent=c.initial;renderChats($("#searchInput").value);
}
$("#messageForm").addEventListener("submit",e=>{
 e.preventDefault();const input=$("#messageInput"),value=input.value.trim();if(!value)return;
 const bubble=document.createElement("div");bubble.className="bubble sent";bubble.textContent=value;
 const time=document.createElement("small");time.textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})+"  ✓";bubble.appendChild(time);
 $("#messages").appendChild(bubble);$("#messages").scrollTop=$("#messages").scrollHeight;input.value="";
 toast("Demo message added on this device");
});
$("#searchInput").addEventListener("input",e=>renderChats(e.target.value));
$("#newChatBtn").addEventListener("click",()=>toast("Connect Supabase to add real contacts and conversations."));
$("#addStory").addEventListener("click",()=>toast("Story publishing will be enabled after backend setup."));
$("#attachBtn").addEventListener("click",()=>toast("File sharing is part of the next development phase."));
$("#emojiBtn").addEventListener("click",()=>$("#messageInput").value+="😊");
$("#seeAll").addEventListener("click",()=>toast("You are viewing the demo conversation list."));
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll("[data-view]").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 const view=b.dataset.view;const titles={chats:"Recent conversations",status:"Status & Stories",groups:"Your groups",vault:"Private Vault",settings:"Settings"};
 $("#sectionTitle").textContent=titles[view]||"Workspace";
 if(view!=="chats")toast(view==="vault"?"Vault is a preview. Secure storage is not enabled yet.":`${titles[view]} — coming in the next phase`);
}));
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderChats();
// CLOQCHAT SUPABASE CONNECTION
const SUPABASE_URL = "https://nptmamnwirnndatdafot.supabase.co
const SUPABASE_KEY = "sb_publishable_4Qxdzq-igkJCowfqYy6b9Q_RZMTHb0x";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
// CLOQCHAT CONNECTION TEST
supabaseClient
  .from("profiles")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      document.body.insertAdjacentHTML(
  "beforeend",
  '<h3 style="color:red;text-align:center">DATABASE ERROR: ' + error.message + '</h3>'
);
    } else {
      document.body.insertAdjacentHTML(
  "beforeend",
  '<h3 style="color:green;text-align:center">CLOQCHAT DATABASE CONNECTED!</h3>'
);
    }
  });
