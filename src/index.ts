const board = document.getElementById("board") as HTMLDivElement;
const timerElement = document.getElementById("timer") as HTMLDivElement;

const cards = ["A", "A", "B", "B", "C", "C", "D", "D"];
let revealedCards: HTMLDivElement[] = [];
let matchedPairs = 0;
let timeLeft = 60;
let timer: number;

// Embaralha as cartas
function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Inicia o jogo
function startGame() {
  shuffle(cards);
  createBoard();
  startTimer();
  startHintThread();
}

// Cria o tabuleiro com as cartas
function createBoard() {
  board.innerHTML = "";
  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.value = card;
    cardElement.dataset.index = index.toString();
    cardElement.addEventListener("click", () => revealCard(cardElement));
    board.appendChild(cardElement);
  });
}

// Revela uma carta
function revealCard(card: HTMLDivElement) {
  if (revealedCards.length < 2 && !card.classList.contains("revealed")) {
    card.classList.add("revealed");
    card.textContent = card.dataset.value || "";
    revealedCards.push(card);

    if (revealedCards.length === 2) {
      checkMatch();
    }
  }
}

// Verifica se as cartas reveladas são um par
function checkMatch() {
  const [card1, card2] = revealedCards;

  if (card1.dataset.value === card2.dataset.value) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;

    if (matchedPairs === cards.length / 2) {
      endGame(true);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("revealed");
      card2.classList.remove("revealed");
      card1.textContent = "";
      card2.textContent = "";
    }, 1000);
  }

  revealedCards = [];
}

// Inicia o timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Tempo: ${timeLeft}s`;

    if (timeLeft === 0) {
      endGame(false);
    }
  }, 1000);
}

// Thread de dicas (revela uma carta aleatória a cada 10 segundos)
function startHintThread() {
  setInterval(() => {
    const unrevealedCards = Array.from(board.children).filter(
      (card) => !card.classList.contains("revealed") && !card.classList.contains("matched")
    ) as HTMLDivElement[];

    if (unrevealedCards.length > 0) {
      const randomCard = unrevealedCards[Math.floor(Math.random() * unrevealedCards.length)];
      randomCard.classList.add("revealed");
      randomCard.textContent = randomCard.dataset.value || "";

      setTimeout(() => {
        randomCard.classList.remove("revealed");
        randomCard.textContent = "";
      }, 1000);
    }
  }, 10000);
}

// Finaliza o jogo
function endGame(isWin: boolean) {
  clearInterval(timer);
  alert(isWin ? "Parabéns! Você venceu!" : "Tempo esgotado! Tente novamente.");
  resetGame();
}

// Reinicia o jogo
function resetGame() {
  timeLeft = 60;
  matchedPairs = 0;
  revealedCards = [];
  timerElement.textContent = `Tempo: ${timeLeft}s`;
  startGame();
}

// Inicia o jogo ao carregar a página
window.onload = startGame;