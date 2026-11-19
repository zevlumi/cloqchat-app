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
const SUPABASE_URL = "https://nptmamnwirnndatdafot.supabase.co";
const SUPABASE_KEY = "sb_publishable_4Qxdzq-igkJCowfqYy6b9Q_RZMTHb0x";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
console.log(window.supabase);
console.log("CLOQCHAT TEST", supabaseClient);
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

// CLOQCHAT SIGNUP SYSTEM

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const message = document.getElementById("authMessage");

  if (!email || !password) {
    message.textContent = "Email aur password enter karo.";
    return;
  }

  message.textContent = "Account ban raha hai...";

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  if (data.user && !data.session) {
    document.getElementById("otpBox").style.display = "block";
    message.textContent = "8-digit OTP aapki email par bhej diya gaya hai. Inbox check karein.";
  } else {
    message.textContent = "Account successfully created!";
  }
});



// CLOQCHAT OTP VERIFICATION

document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const token = document.getElementById("otpCode").value.trim();
  const message = document.getElementById("authMessage");

  if (token.length !== 8) {
    message.textContent = "8-digit OTP enter karo.";
    return;
  }

  message.textContent = "OTP verify ho raha hai...";

  const { error } = await supabaseClient.auth.verifyOtp({
    email,
    token,
    type: "signup"
  });

  if (error) {
    message.textContent = error.message;
  } else {
    message.textContent = "Email verified! CLOQCHAT mein welcome.";
    document.getElementById("otpBox").style.display = "none";
  }
});
// CLOQCHAT LOGIN SYSTEM

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const message = document.getElementById("authMessage");

  if (!email || !password) {
    message.textContent = "Email aur password enter karo.";
    return;
  }

  message.textContent = "Login ho raha hai...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
  } else {
    message.textContent = "Login successful! Welcome to CLOQCHAT.";
  }
});
// CLOQCHAT PASSWORD SHOW / HIDE

document.getElementById("togglePassword").addEventListener("click", () => {
  const password = document.getElementById("authPassword");
  const eyeButton = document.getElementById("togglePassword");

  if (password.type === "password") {
    password.type = "text";
    eyeButton.textContent = "👁️";
  } else {
    password.type = "password";
    eyeButton.textContent = "🙈";
  }
});

// CLOQCHAT SIGNUP / LOGIN TABS

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const authTitle = document.querySelector(".auth-box h2");
const authMessage = document.getElementById("authMessage");

showSignup.addEventListener("click", () => {
  signupBtn.style.display = "block";
  loginBtn.style.display = "none";
  authTitle.textContent = "Create Account";
  showSignup.classList.add("active");
  showLogin.classList.remove("active");
  authMessage.textContent = "";
 forgotPasswordBtn.style.display = "none";
});

showLogin.addEventListener("click", () => {
  signupBtn.style.display = "none";
  loginBtn.style.display = "block";
  authTitle.textContent = "Welcome Back";
  showLogin.classList.add("active");
  showSignup.classList.remove("active");
  authMessage.textContent = "";
 forgotPasswordBtn.style.display = "block";
});
// CLOQCHAT FORGOT PASSWORD SYSTEM

let resetCooldownTimer;

document.getElementById("forgotPasswordBtn").addEventListener("click", async () => {
  const email = document.getElementById("authEmail").value.trim();
  const message = document.getElementById("authMessage");
  const button = document.getElementById("forgotPasswordBtn");

  if (!email) {
    message.textContent = "Pehle apna email enter karo.";
    return;
  }

  if (button.disabled) return;

  button.disabled = true;
  message.textContent = "Reset email bheji ja rahi hai...";

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    button.disabled = false;

    if (
      error.message.toLowerCase().includes("rate limit") ||
      error.message.toLowerCase().includes("limit exceeded")
    ) {
      message.textContent =
        "Email limit poori ho gayi hai. Kuch der baad dobara try karein.";
    } else {
      message.textContent = error.message;
    }

    return;
  }

  let seconds = 60;
  message.textContent =
    "Reset email bhej di gayi hai. Dobara try karne ke liye 60 seconds wait karein.";

  button.textContent = "Wait 60s";

  resetCooldownTimer = setInterval(() => {
    seconds--;

    if (seconds > 0) {
      button.textContent = `Wait ${seconds}s`;
    } else {
      clearInterval(resetCooldownTimer);
      button.disabled = false;
      button.textContent = "Forgot Password?";
      message.textContent = "Ab dobara reset email bhej sakte hain.";
    }
  }, 1000);
});


// CLOQCHAT PASSWORD RESET
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
    document.getElementById("resetPasswordBox").style.display = "block";

    document.querySelector(".auth-box h2").textContent = "Choose New Password";
    document.getElementById("authEmail").style.display = "none";
    document.querySelector(".password-wrap").style.display = "none";
    document.querySelector(".auth-tabs").style.display = "none";
    document.getElementById("signupBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("forgotPasswordBtn").style.display = "none";
  }
});


document.getElementById("updatePasswordBtn").addEventListener("click", async () => {
  const newPassword = document.getElementById("newPassword").value;
  const message = document.getElementById("resetMessage");

  if (newPassword.length < 6) {
    message.textContent = "Password kam az kam 6 characters ka hona chahiye.";
    return;
  }

  message.textContent = "Password update ho raha hai...";

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });

  if (error) {
    message.textContent = error.message;
  } else {
    message.textContent = "Password successfully change ho gaya!";
  }
});
