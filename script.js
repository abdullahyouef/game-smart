
// أيقونات Font Awesome
const symbols = [
    "fa-star", "fa-heart", "fa-bolt", "fa-moon",
    "fa-sun", "fa-gem", "fa-cube", "fa-apple-alt"
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 8;
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;
let gameCompleted = false;

// عناصر DOM
const gameBoard = document.getElementById("gameBoard");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const winModal = document.getElementById("winModal");
const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");
const playAgainBtn = document.getElementById("playAgainBtn");

initGame(); // بداية اللعبة

// تهيئة / إعادة اللعبة
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    gameCompleted = false;

    timerEl.textContent = "00:00";
    movesEl.textContent = "0";
    matchesEl.textContent = "0/8";

    createCards();

    startBtn.disabled = false;
    resetBtn.disabled = true;
    clearInterval(timerInterval);
    winModal.style.display = "none";
}

// إنشاء البطاقات
function createCards() {
    gameBoard.innerHTML = "";
    const cardSymbols = [];
    for (let i = 0; i < totalPairs; i++) cardSymbols.push(symbols[i], symbols[i]);
    shuffle(cardSymbols);

    cardSymbols.forEach((symbol, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.symbol = symbol;
        card.dataset.index = idx;

        const front = document.createElement("div");
        front.className = "face front";
        front.innerHTML = '<i class="fas fa-question"></i>';

        const back = document.createElement("div");
        back.className = "face back";
        back.innerHTML = `<i class="fas ${symbol}"></i>`;

        card.append(front, back);
        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// خلط المصفوفة
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// صوت مطابقة (مجاني)
function playMatchSound() {
    const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav");
    audio.volume = 0.3;
    audio.play().catch(() => { });
}

// قلب البطاقة
function flipCard(card) {
    if (!gameStarted || gameCompleted) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
    if (flippedCards.length >= 2) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = moves;

        const [c1, c2] = flippedCards;
        if (c1.dataset.symbol === c2.dataset.symbol) {
            setTimeout(() => {
                c1.classList.add("matched");
                c2.classList.add("matched");
                flippedCards = [];
                matchedPairs++;
                matchesEl.textContent = `${matchedPairs}/8`;
                playMatchSound();
                if (matchedPairs === totalPairs) endGame();
            }, 500);
        } else {
            setTimeout(() => {
                c1.classList.remove("flipped");
                c2.classList.remove("flipped");
                flippedCards = [];
            }, 1000);
        }
    }
}

// بدء اللعبة
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;

    timerInterval = setInterval(() => {
        timer++;
        const m = String(Math.floor(timer / 60)).padStart(2, "0");
        const s = String(timer % 60).padStart(2, "0");
        timerEl.textContent = `${m}:${s}`;
    }, 1000);
}

// نهاية اللعبة
function endGame() {
    gameCompleted = true;
    clearInterval(timerInterval);
    finalTime.textContent = timerEl.textContent;
    finalMoves.textContent = moves;
    winModal.style.display = "flex";
}

// أزرار التحكم
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame);

