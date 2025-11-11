// الرموز المستخدمة في اللعبة
const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🍋'];

// متغيرات اللعبة
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 8;
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;
let gameCompleted = false;

// العناصر
const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const winModal = document.getElementById('winModal');
const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const playAgainBtn = document.getElementById('playAgainBtn');

// تهيئة اللعبة
function initGame() {
    // إعادة تعيين المتغيرات
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    gameCompleted = false;
    
    // تحديث واجهة المستخدم
    timerElement.textContent = '00:00';
    movesElement.textContent = '0';
    matchesElement.textContent = '0/8';
    
    // إنشاء البطاقات
    createCards();
    
    // إعادة تعيين الأزرار
    startBtn.disabled = false;
    resetBtn.disabled = true;
    
    // إيقاف المؤقت
    clearInterval(timerInterval);
    
    // إخفاء نافذة الفوز
    winModal.style.display = 'none';
}

// إنشاء البطاقات
function createCards() {
    gameBoard.innerHTML = '';
    
    // إنشاء مجموعة الرموز (كل رمز مرتين)
    const cardSymbols = [];
    for (let i = 0; i < totalPairs; i++) {
        cardSymbols.push(symbols[i], symbols[i]);
    }
    
    // خلط الرموز
    shuffleArray(cardSymbols);
    
    // إنشاء البطاقات
    cards = cardSymbols.map((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        const front = document.createElement('div');
        front.className = 'front';
        front.textContent = '?';
        
        const back = document.createElement('div');
        back.className = 'back';
        back.textContent = symbol;
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', () => flipCard(card));
        
        gameBoard.appendChild(card);
        return card;
    });
}

// خلط المصفوفة (خوارزمية فيشر-ييتس)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// قلب البطاقة
function flipCard(card) {
    // التحقق من شروط اللعبة
    if (!gameStarted || gameCompleted) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    // قلب البطاقة
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // التحقق من التطابق عند قلب بطاقتين
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // تطابق ناجح
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                flippedCards = [];
                
                matchedPairs++;
                matchesElement.textContent = `${matchedPairs}/8`;
                
                // التحقق من فوز اللاعب
                if (matchedPairs === totalPairs) {
                    endGame();
                }
            }, 500);
        } else {
            // تطابق فاشل - إعادة البطاقات بعد فترة
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
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
    
    // بدء المؤقت
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// إنهاء اللعبة
function endGame() {
    gameCompleted = true;
    clearInterval(timerInterval);
    
    // عرض نافذة الفوز
    finalTime.textContent = timerElement.textContent;
    finalMoves.textContent = moves;
    winModal.style.display = 'flex';
}

// إضافة المستمعين للأحداث
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// التهيئة الأولية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initGame);