// Array de cartas com pares correspondentes
const cards = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];

// Variáveis para armazenar as cartas selecionadas e o número de pares encontrados
let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let matchedPairs = 0;
let timer = 60; // Tempo inicial em segundos

// Criação de um worker para gerenciar dicas
const worker = new Worker('worker.js');
worker.postMessage({ type: 'startHints' });

// Escuta mensagens do worker para revelar cartas aleatórias
worker.addEventListener('message', (e) => {
    if (e.data.type === 'hint') {
        revealRandomCard(); // Chama a função para revelar uma carta aleatória
    }
});

// Função para revelar uma carta aleatória por 1 segundo
function revealRandomCard() {
    const board = document.getElementById('game-board');
    if (!board) return;
    const unflippedCards = Array.from(board.children).filter((card) => (card as HTMLElement).innerText === '?');
    if (unflippedCards.length === 0) return;

    const randomCard = unflippedCards[Math.floor(Math.random() * unflippedCards.length)] as HTMLElement;
    randomCard.innerText = randomCard.dataset.value || '';
    randomCard.classList.add('flipped');

    setTimeout(() => {
        randomCard.innerText = '?';
        randomCard.classList.remove('flipped');
    }, 1000);
}

// Função para iniciar o cronômetro
function startTimer() {
    const timerInterval = setInterval(() => {
        timer--;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `Tempo: ${timer}s`;
        }
        if (timer <= 0) {
            clearInterval(timerInterval);
            if (matchedPairs === cards.length / 2) {
                showVictoryMessage();
            } else {
                showDefeatMessage();
            }
        }
    }, 1000);
}

// Função para criar o tabuleiro de cartas
function createBoard() {
    const board = document.getElementById('game-board');
    if (board) {
        cards.sort(() => 0.5 - Math.random());
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card;
            cardElement.innerText = '?';
            cardElement.addEventListener('click', () => onCardClick(cardElement));
            board.appendChild(cardElement);
        });
    }
}

// Função chamada ao clicar em uma carta
function onCardClick(cardElement: HTMLElement) {
    if (firstCard && secondCard) return;

    cardElement.innerText = cardElement.dataset.value || '';
    cardElement.classList.add('flipped');

    if (!firstCard) {
        firstCard = cardElement;
    } else if (firstCard && !secondCard && cardElement !== firstCard) {
        secondCard = cardElement;
        if (firstCard.dataset.value === secondCard.dataset.value) {
            matchedPairs++;
            resetCards();
        } else {
            setTimeout(() => {
                if (firstCard && secondCard) {
                    firstCard.innerText = '?';
                    secondCard.innerText = '?';
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    resetCards();
                }
            }, 1000);
        }
    }
}

// Função para resetar as cartas selecionadas
function resetCards() {
    firstCard = null;
    secondCard = null;
}

// Exibe mensagem de vitória
function showVictoryMessage() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = 'Parabéns! Você ganhou!';
        messageElement.style.color = 'green';
    }
}

// Exibe mensagem de derrota
function showDefeatMessage() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = 'Que pena! Você não conseguiu encontrar todos os pares a tempo.';
        messageElement.style.color = 'red';
    }
}

// Chama o worker para revelar uma carta a cada 10 segundos
setInterval(() => {
    worker.postMessage({ type: 'hint' });
}, 10000);

createBoard(); // Cria o tabuleiro
startTimer(); // Inicia o cronômetro