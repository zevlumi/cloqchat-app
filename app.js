
const demoChats = [
  {id:1,name:"Ayesha Khan",initial:"A",preview:"This is the beginning of something great ✨",time:"10:26",color:"teal"},
  {id:2,name:"Usman Ali",initial:"U",preview:"Sent you a photo",time:"Yesterday",color:"blue"},
  {id:3,name:"Sara Ahmed",initial:"S",preview:"Are we still meeting today?",time:"Mon",color:"pink"},
  {id:4,name:"Hamza Raza",initial:"H",preview:"Voice message",time:"Sun",color:"gold"}
];

let activeId = 1;

const $ = s => document.querySelector(s);

const toast = msg => {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
};

// CLOQCHAT CHAT INTERFACE

function renderChats(filter = "") {
  const list = demoChats.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  $("#chatList").innerHTML = list.slice(0,4).map(c =>
    `<button class="nav-item" data-chat="${c.id}">● <span>${c.name}</span></button>`
  ).join("");

  $("#conversationCards").innerHTML = list.map(c =>
    `<button class="conversation-card ${c.id===activeId?"selected":""}" data-chat="${c.id}">
      <div class="avatar">${c.initial}</div>
      <div class="meta"><b>${c.name}</b><p>${c.preview}</p></div>
      <time>${c.time}</time>
    </button>`
  ).join("") || '<p class="muted" style="padding:18px">No conversations found.</p>';

  document.querySelectorAll("[data-chat]").forEach(b =>
    b.addEventListener("click", () => selectChat(Number(b.dataset.chat)))
  );
}

function selectChat(id) {
  activeId = id;
  const c = demoChats.find(x => x.id === id);
  if (!c) return;

  $("#activeName").textContent = c.name;
  $("#activeAvatar").textContent = c.initial;
  renderChats($("#searchInput").value);
}

$("#messageForm").addEventListener("submit", e => {
  e.preventDefault();

  const input = $("#messageInput");
  const value = input.value.trim();
  if (!value) return;

  const bubble = document.createElement("div");
  bubble.className = "bubble sent";
  bubble.textContent = value;

  const time = document.createElement("small");
  time.textContent = new Date().toLocaleTimeString([], {
    hour:"2-digit",
    minute:"2-digit"
  }) + "  ✓";

  bubble.appendChild(time);
  $("#messages").appendChild(bubble);
  $("#messages").scrollTop = $("#messages").scrollHeight;
  input.value = "";

  toast("Demo message added on this device");
});

$("#searchInput").addEventListener("input", e => renderChats(e.target.value));

$("#newChatBtn").addEventListener("click", () =>
  toast("Connect Supabase to add real contacts and conversations.")
);

$("#addStory").addEventListener("click", () =>
  toast("Story publishing will be enabled after backend setup.")
);

$("#attachBtn").addEventListener("click", () =>
  toast("File sharing is part of the next development phase.")
);

$("#emojiBtn").addEventListener("click", () =>
  $("#messageInput").value += "😊"
);

$("#seeAll").addEventListener("click", () =>
  toast("You are viewing the demo conversation list.")
);

document.querySelectorAll("[data-view]").forEach(b =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(x =>
      x.classList.remove("active")
    );

    b.classList.add("active");

    const view = b.dataset.view;

    const titles = {
      chats:"Recent conversations",
      status:"Status & Stories",
      groups:"Your groups",
      vault:"Private Vault",
      settings:"Settings"
    };

    $("#sectionTitle").textContent = titles[view] || "Workspace";

    if (view !== "chats") {
      toast(view === "vault"
        ? "Vault is a preview. Secure storage is not enabled yet."
        : `${titles[view]} — coming in the next phase`);
    }
  })
);

// CLOQCHAT SERVICE WORKER

if ("serviceWorker" in navigator &&
    location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

renderChats();

// CLOQCHAT SUPABASE CONNECTION

const SUPABASE_URL = "https://nptmamnwirnndatdafot.supabase.co";
const SUPABASE_KEY = "sb_publishable_4Qxdzq-igkJCowfqYy6b9Q_RZMTHb0x";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// DATABASE CONNECTION TEST

supabaseClient
  .from("profiles")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("CLOQCHAT DATABASE ERROR:", error.message);
    } else {
      console.log("CLOQCHAT DATABASE CONNECTED!");
    }
  });

// CLOQCHAT AUTH SCREEN ELEMENTS

const authScreen = document.getElementById("authScreen");
const appShell = document.querySelector(".app-shell");

const authTitle = document.getElementById("authTitle");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");

const authCredentials = document.getElementById("authCredentials");
const signupActions = document.getElementById("signupActions");
const loginActions = document.getElementById("loginActions");
const otpBox = document.getElementById("otpBox");
const resetPasswordBox = document.getElementById("resetPasswordBox");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

let pendingSignupEmail = "";

// CLOQCHAT SCREEN CONTROLS

function showSignupScreen() {
  authTitle.textContent = "Create Account";

  authCredentials.style.display = "block";
  forgotPasswordBtn.style.display = "none";
  signupActions.style.display = "block";
  loginActions.style.display = "none";
  otpBox.style.display = "none";
  resetPasswordBox.style.display = "none";

  authEmail.style.display = "block";
  document.querySelector(".password-wrap").style.display = "flex";

  authPassword.autocomplete = "new-password";
  authMessage.textContent = "";
}

function showLoginScreen() {
  authTitle.textContent = "Welcome Back";
  authCredentials.style.display = "block";
  forgotPasswordBtn.style.display = "block";
  signupActions.style.display = "none";
  loginActions.style.display = "block";
  loginActions.style.visibility = "visible";
  otpBox.style.display = "none";
  resetPasswordBox.style.display = "none";

  authEmail.style.display = "block";
  document.querySelector(".password-wrap").style.display = "flex";

  authPassword.autocomplete = "current-password";
  authMessage.textContent = "";
}

function showOtpScreen() {
  authTitle.textContent = "Verify Your Email";

  authCredentials.style.display = "none";
  signupActions.style.display = "none";
  loginActions.style.display = "none";
  otpBox.style.display = "block";
  resetPasswordBox.style.display = "none";

  document.getElementById("otpCode").value = "";
  authMessage.textContent = "Apna email check karein aur 8-digit OTP enter karein.";
}

function showResetScreen() {
  authTitle.textContent = "Choose New Password";

  authCredentials.style.display = "none";
  signupActions.style.display = "none";
  loginActions.style.display = "none";
  otpBox.style.display = "none";
  resetPasswordBox.style.display = "block";

  authMessage.textContent = "";
}

function showAuthenticatedApp() {
  authScreen.style.display = "none";
  appShell.style.display = "";
}

function showAuthentication() {
  appShell.style.display = "none";
  authScreen.style.display = "flex";
}

// CLOQCHAT SIGNUP SYSTEM

signupBtn.addEventListener("click", async () => {
  const email = authEmail.value.trim();
  const password = authPassword.value;

  if (!email || !password) {
    authMessage.textContent = "Email aur password enter karo.";
    return;
  }

  if (password.length < 6) {
    authMessage.textContent = "Password kam az kam 6 characters ka hona chahiye.";
    return;
  }

  signupBtn.disabled = true;
  authMessage.textContent = "Account ban raha hai...";

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      authMessage.textContent = error.message;
      return;
    }

    if (data.session) {
      showAuthenticatedApp();
      toast("Welcome to CLOQCHAT!");
      return;
    }

    if (data.user) {
      pendingSignupEmail = email;
      showOtpScreen();
    } else {
      authMessage.textContent = "Signup complete nahi hua. Dobara try karein.";
    }

  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    signupBtn.disabled = false;
  }
});

// CLOQCHAT OTP VERIFICATION

document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const token = document.getElementById("otpCode").value.trim();
  const email = pendingSignupEmail || authEmail.value.trim();
  const button = document.getElementById("verifyOtpBtn");

  if (!/^\d{8}$/.test(token)) {
    authMessage.textContent = "8-digit OTP enter karo.";
    return;
  }

  if (!email) {
    authMessage.textContent = "Signup email nahi mila. Dobara signup karein.";
    return;
  }

  button.disabled = true;
  authMessage.textContent = "OTP verify ho raha hai...";

  try {
    const { error } = await supabaseClient.auth.verifyOtp({
      email,
      token,
      type: "signup"
    });

    if (error) {
      authMessage.textContent = error.message;
    } else {
      pendingSignupEmail = "";
      showAuthenticatedApp();
      toast("Email verified! Welcome to CLOQCHAT.");
    }

  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

// CLOQCHAT RESEND OTP

document.getElementById("resendOtpBtn").addEventListener("click", async () => {
  const email = pendingSignupEmail || authEmail.value.trim();
  const button = document.getElementById("resendOtpBtn");

  if (!email) {
    authMessage.textContent = "Signup email nahi mila.";
    return;
  }

  button.disabled = true;
  authMessage.textContent = "Naya OTP bheja ja raha hai...";

  try {
    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email
    });

    if (error) {
      authMessage.textContent = error.message;
    } else {
      authMessage.textContent = "Agar email eligible hai to naya OTP bhej diya gaya hai. Apna inbox check karein.";
    }

  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

// CLOQCHAT LOGIN SYSTEM

loginBtn.addEventListener("click", async () => {
  const email = authEmail.value.trim();
  const password = authPassword.value;

  if (!email || !password) {
    authMessage.textContent = "Email aur password enter karo.";
    return;
  }

  loginBtn.disabled = true;
  authMessage.textContent = "Login ho raha hai...";

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      authMessage.textContent = error.message;
    } else {
      showAuthenticatedApp();
      toast("Login successful! Welcome to CLOQCHAT.");
    }

  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    loginBtn.disabled = false;
  }
});

// CLOQCHAT SIGNUP / LOGIN NAVIGATION

if (showSignup && showLogin) {
  showSignup.addEventListener("click", function(e) {
    e.preventDefault();
    showSignupScreen();
  });

  showLogin.addEventListener("click", function(e) {
    e.preventDefault();
    showLoginScreen();
  });
} else {
  console.error("Signup/Login navigation links not found.");
}

// CLOQCHAT PASSWORD SHOW / HIDE

document.getElementById("togglePassword").addEventListener("click", () => {
  const eyeButton = document.getElementById("togglePassword");

  if (authPassword.type === "password") {
    authPassword.type = "text";
    eyeButton.textContent = "👁️";
  } else {
    authPassword.type = "password";
    eyeButton.textContent = "🙈";
  }
});

// CLOQCHAT FORGOT PASSWORD

forgotPasswordBtn.addEventListener("click", async () => {
  const email = authEmail.value.trim();

  if (!email) {
    authMessage.textContent = "Pehle apna email enter karo.";
    return;
  }

  forgotPasswordBtn.disabled = true;
  authMessage.textContent = "Reset email bheji ja rahi hai...";

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("rate limit") ||
        error.message.toLowerCase().includes("limit exceeded")
      ) {
        authMessage.textContent =
          "Email limit poori ho gayi hai. Kuch der baad dobara try karein.";
      } else {
        authMessage.textContent = error.message;
      }
    } else {
      authMessage.textContent =
        "Agar is email par account maujood hai to password reset email bhej di gayi hai. Apna inbox check karein.";
    }

  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    forgotPasswordBtn.disabled = false;
  }
});

// CLOQCHAT PASSWORD RECOVERY EVENT

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
    showAuthentication();
    showResetScreen();
  }

  if (
    session &&
    event !== "PASSWORD_RECOVERY"
  ) {
    showAuthenticatedApp();
  }

  if (event === "SIGNED_OUT") {
    showAuthentication();
    showLoginScreen();
  }
});

// CLOQCHAT UPDATE PASSWORD

document.getElementById("updatePasswordBtn").addEventListener("click", async () => {
  const newPassword = document.getElementById("newPassword").value;
  const message = document.getElementById("resetMessage");
  const button = document.getElementById("updatePasswordBtn");

  if (newPassword.length < 6) {
    message.textContent = "Password kam az kam 6 characters ka hona chahiye.";
    return;
  }

  button.disabled = true;
  message.textContent = "Password update ho raha hai...";

  try {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword
    });

    if (error) {
      message.textContent = error.message;
    } else {
      message.textContent = "Password successfully change ho gaya! Ab naye password se login kar sakte hain.";

      await supabaseClient.auth.signOut();
    }

  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

// CLOQCHAT INITIAL AUTH CHECK

async function initializeAuth() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    if (data.session) {
      showAuthenticatedApp();
    } else {
      showAuthentication();
      showSignupScreen();
    }

  } catch (error) {
    console.error("Session check error:", error.message);
    showAuthentication();
    showSignupScreen();
  }
}

initializeAuth();
                              
