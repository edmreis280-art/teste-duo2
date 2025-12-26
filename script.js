// --- DATABASE LOCAL ---
const getUsers = () => JSON.parse(localStorage.getItem('duo_users')) || [];
const getActive = () => JSON.parse(sessionStorage.getItem('duo_active'));

// --- AUTH ---
function register() {
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    if(!user || !pass) return alert("Preencha os campos!");

    let users = getUsers();
    if(users.find(u => u.name.toLowerCase() === user.toLowerCase())) return alert("Usuário já existe!");

    users.push({ name: user, pass: pass, xp: 0 });
    localStorage.setItem('duo_users', JSON.stringify(users));
    alert("Conta criada!"); window.location.href = 'index.html';
}

function login() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const auth = getUsers().find(u => u.name === user && u.pass === pass);

    if(auth) {
        sessionStorage.setItem('duo_active', JSON.stringify(auth));
        window.location.href = 'dashboard.html';
    } else {
        alert("Dados incorretos!");
    }
}

function logout() { sessionStorage.clear(); window.location.href = 'index.html'; }

// --- MOTOR DE EXERCÍCIOS ---
let currentQ = 0;
const questions = [
    { q: 'Como se diz "Maçã"?', opt: ['Banana', 'Apple', 'Water'], ans: 1, word: 'Apple' },
    { q: 'Traduza: "Good Morning"', opt: ['Bom dia', 'Boa noite', 'Olá'], ans: 0, word: 'Good Morning' },
    { q: 'Qual é "Amigo"?', opt: ['Enemy', 'Friend', 'Teacher'], ans: 1, word: 'Friend' }
];

function startLesson() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('exerciseArea').style.display = 'block';
    loadQ();
}

function loadQ() {
    const q = questions[currentQ];
    document.getElementById('questionTitle').innerText = q.q;
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.opt.forEach((o, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = o;
        btn.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            btn.dataset.idx = i;
        };
        container.appendChild(btn);
    });
}

function checkAnswer() {
    const sel = document.querySelector('.option-btn.selected');
    if(!sel) return;

    const correct = parseInt(sel.dataset.idx) === questions[currentQ].ans;
    const fb = document.getElementById('feedbackArea');
    fb.style.display = 'block';

    if(correct) {
        fb.className = 'feedback correct';
        document.getElementById('feedbackText').innerText = "Mandou bem! +10 XP";
        updateXP(10);
    } else {
        fb.className = 'feedback wrong';
        document.getElementById('feedbackText').innerText = "A resposta era: " + questions[currentQ].opt[questions[currentQ].ans];
    }
}

function nextQuestion() {
    currentQ++;
    document.getElementById('feedbackArea').style.display = 'none';
    if(currentQ < questions.length) {
        loadQ();
    } else {
        alert("Lição finalizada!");
        window.location.href = 'dashboard.html';
    }
}

function speakWord() {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(questions[currentQ].word);
    utter.lang = 'en-US';
    synth.speak(utter);
}

function updateXP(val) {
    let active = getActive();
    let users = getUsers();
    let idx = users.findIndex(u => u.name === active.name);
    
    users[idx].xp += val;
    active.xp += val;
    
    localStorage.setItem('duo_users', JSON.stringify(users));
    sessionStorage.setItem('duo_active', JSON.stringify(active));
    document.getElementById('xpDisplay').innerText = active.xp;
}

// Proteção de Rota
window.onload = () => {
    if(window.location.pathname.includes('dashboard.html')) {
        const active = getActive();
        if(!active) window.location.href = 'index.html';
        document.getElementById('userNameDisplay').innerText = `👤 ${active.name}`;
        document.getElementById('xpDisplay').innerText = active.xp;
    }
};
