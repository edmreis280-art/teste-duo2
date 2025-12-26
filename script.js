// ===== USUÁRIOS =====

function getUsers() {

  return JSON.parse(localStorage.getItem("users")) || [];

}



function saveUsers(users) {

  localStorage.setItem("users", JSON.stringify(users));

}



// ===== CADASTRO =====

function register() {

  const user = regUser.value;

  const pass = regPass.value;

  const pass2 = regPass2.value;



  if (!user || !pass) return alert("Preencha tudo");

  if (pass !== pass2) return alert("Senhas diferentes");



  const users = getUsers();

  if (users.find(u => u.user === user))

    return alert("Usuário já existe");



  users.push({ user, pass, xp: 0, progress: 0 });

  saveUsers(users);



  alert("Conta criada!");

  location.href = "login.html";

}



// ===== LOGIN =====

function login() {

  const user = loginUser.value;

  const pass = loginPass.value;



  const users = getUsers();

  const found = users.find(u => u.user === user && u.pass === pass);



  if (!found) return alert("Login inválido");



  localStorage.setItem("logged", user);

  location.href = "index.html";

}



// ===== DASHBOARD =====

const logged = localStorage.getItem("logged");

if (logged && document.getElementById("userName")) {

  const users = getUsers();

  const user = users.find(u => u.user === logged);



  userName.innerText = user.user;

  xp.innerText = user.xp;

  progressBar.style.width = user.progress + "%";

}



// ===== FLASHCARDS =====

const words = [

  { en: "Hello", pt: "Olá" },

  { en: "Goodbye", pt: "Adeus" },

  { en: "Thanks", pt: "Obrigado" }

];



let index = 0;



function nextCard() {

  index = (index + 1) % words.length;

  word.innerText = words[index].en;

  translation.innerText = words[index].pt;

}



function correct() {

  feedback.innerText = "Mandou bem!";

  feedback.style.color = "green";

  gainXP();

}



function speak() {

  const utter = new SpeechSynthesisUtterance(word.innerText);

  utter.lang = "en-US";

  speechSynthesis.speak(utter);

}



// ===== XP =====

function gainXP() {

  const users = getUsers();

  const user = users.find(u => u.user === logged);



  user.xp += 10;

  user.progress = Math.min(user.progress + 10, 100);



  saveUsers(users);



  xp.innerText = user.xp;

  progressBar.style.width = user.progress + "%";

}

