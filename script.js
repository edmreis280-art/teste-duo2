// --- SISTEMA DE DADOS (LOCALSTORAGE) ---
const getData = () => JSON.parse(localStorage.getItem('users')) || [];
const getCurrentUser = () => JSON.parse(sessionStorage.getItem('loggedUser'));

// --- CADASTRO ---
function register() {
    const user = document.getElementById('regUser').value;
    const pass = document.getElementById('regPass').value;
    const users = getData();

    if (users.find(u => u.username === user)) {
        alert("Usuário já existe!");
        return;
    }

    const newUser = { username: user, password: pass, xp: 0, level: 'Iniciante' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Conta criada! Vá para o Login.");
    window.location.href = 'login.html';
}

// --- LOGIN ---
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    const users = getData();

    const found = users.find(u => u.username === user && u.password === pass);
    if (found) {
        sessionStorage.setItem('loggedUser', JSON.stringify(found));
        window.location.href = 'index.html';
    } else {
        alert("Dados incorretos!");
    }
}

// --- MECÂNICA DE LIÇÃO ---
let currentQuestion = 0;
const questions = [
    { q: 'Como se diz "Olá"?', options: ['Hello', 'Goodbye', 'Apple'], correct: 0, word: 'Hello' },
    { q: 'Qual dessas é "Maçã"?', options: ['Bread', 'Apple', 'Water'], correct: 1, word: 'Apple' },
    { q: 'Traduza: "I am a student"', options: ['Eu sou professor', 'Eu sou estudante', 'Eu tenho um carro'], correct: 1, word: 'I am a student' }
];

function startLesson() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('exerciseArea').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionTitle').innerText = q.q;
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            btn.dataset.index = index;
        };
        container.appendChild(btn);
    });
}

function checkAnswer() {
    const selected = document.querySelector('.option-btn.selected');
    if (!selected) return;

    const answer = parseInt(selected.dataset.index);
    const isCorrect = answer === questions[currentQuestion].correct;
    const feedback = document.getElementById('feedbackArea');

    if (isCorrect) {
        feedback.className = 'feedback correct';
        document.getElementById('feedbackText').innerText = "Mandou bem! +10 XP";
        updateXP(10);
        playTone(800, 0.2); // Som de acerto
    } else {
        feedback.className = 'feedback wrong';
        document.getElementById('feedbackText').innerText = "Ops! Resposta errada.";
    }
}

function nextQuestion() {
    currentQuestion++;
    document.getElementById('feedbackArea').style.display = 'none';
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        alert("Lição Concluída!");
        window.location.reload();
    }
}

// --- UTILITÁRIOS ---
function speakWord() {
    const msg = new SpeechSynthesisUtterance();
    msg.text = questions[currentQuestion].word;
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function updateXP(val) {
    let user = getCurrentUser();
    user.xp += val;
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
    
    // Atualiza no localStorage global também
    let users = getData();
    let idx = users.findIndex(u => u.username === user.username);
    users[idx].xp = user.xp;
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('xpDisplay').innerText = user.xp;
}

// Inicialização da Dashboard
if (document.getElementById('userNameDisplay')) {
    const user = getCurrentUser();
    if (!user) window.location.href = 'login.html';
    document.getElementById('userNameDisplay').innerText = `👤 ${user.username}`;
    document.getElementById('xpDisplay').innerText = user.xp;
}

// Função simples para som (Web Audio API)
function playTone(freq, dur) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.stop(ctx.currentTime + dur);
}
