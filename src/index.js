"use strict"; // Modo estrito (não tem tradução direta, mas pode ser entendido como "uso restrito")
const tabuleiro = document.getElementById("board"); // Tabuleiro do jogo
const elementoDoTempo = document.getElementById("timer"); // Elemento que exibe o tempo
const cartas = ["A", "A", "B", "B", "C", "C", "D", "D"]; // Cartas do jogo
let cartasReveladas = []; // Cartas que estão viradas para cima
let paresCorrespondentes = 0; // Contador de pares encontrados
let tempoRestante = 60; // Tempo inicial do jogo
let temporizador; // Variável para armazenar o temporizador

// Embaralha as cartas
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Inicia o jogo
function iniciarJogo() {
    embaralhar(cartas);
    criarTabuleiro();
    iniciarTemporizador();
    iniciarThreadDeDicas();
}

// Cria o tabuleiro com as cartas
function criarTabuleiro() {
    tabuleiro.innerHTML = ""; // Limpa o tabuleiro
    cartas.forEach((carta, indice) => {
        const elementoCarta = document.createElement("div");
        elementoCarta.classList.add("card"); // Adiciona a classe "card"
        elementoCarta.dataset.valor = carta; // Armazena o valor da carta
        elementoCarta.dataset.indice = indice.toString(); // Armazena o índice da carta
        elementoCarta.addEventListener("click", () => revelarCarta(elementoCarta)); // Adiciona evento de clique
        tabuleiro.appendChild(elementoCarta); // Adiciona a carta ao tabuleiro
    });
}

// Revela uma carta
function revelarCarta(carta) {
    if (cartasReveladas.length < 2 && !carta.classList.contains("revealed")) {
        carta.classList.add("revealed"); // Revela a carta
        carta.textContent = carta.dataset.valor || ""; // Mostra o valor da carta
        cartasReveladas.push(carta); // Adiciona à lista de cartas reveladas

        if (cartasReveladas.length === 2) {
            verificarPar(); // Verifica se as cartas formam um par
        }
    }
}

// Verifica se as cartas reveladas são um par
function verificarPar() {
    const [carta1, carta2] = cartasReveladas;

    if (carta1.dataset.valor === carta2.dataset.valor) {
        carta1.classList.add("matched"); // Marca como par correspondente
        carta2.classList.add("matched"); // Marca como par correspondente
        paresCorrespondentes++; // Incrementa o contador de pares

        if (paresCorrespondentes === cartas.length / 2) {
            finalizarJogo(true); // Finaliza o jogo com vitória
        }
    } else {
        setTimeout(() => {
            carta1.classList.remove("revealed"); // Esconde a carta
            carta2.classList.remove("revealed"); // Esconde a carta
            carta1.textContent = ""; // Limpa o conteúdo
            carta2.textContent = ""; // Limpa o conteúdo
        }, 1000);
    }

    cartasReveladas = []; // Limpa a lista de cartas reveladas
}

// Inicia o temporizador
function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tempoRestante--;
        elementoDoTempo.textContent = `Tempo: ${tempoRestante}s`;

        if (tempoRestante === 0) {
            finalizarJogo(false); // Finaliza o jogo com derrota
        }
    }, 1000);
}

// Thread de dicas (revela uma carta aleatória a cada 10 segundos)
function iniciarThreadDeDicas() {
    setInterval(() => {
        const cartasNaoReveladas = Array.from(tabuleiro.children).filter(
            (carta) => !carta.classList.contains("revealed") && !carta.classList.contains("matched")
        );

        if (cartasNaoReveladas.length > 0) {
            const cartaAleatoria = cartasNaoReveladas[Math.floor(Math.random() * cartasNaoReveladas.length)];
            cartaAleatoria.classList.add("revealed"); // Revela a carta
            cartaAleatoria.textContent = cartaAleatoria.dataset.valor || ""; // Mostra o valor

            setTimeout(() => {
                cartaAleatoria.classList.remove("revealed"); // Esconde a carta
                cartaAleatoria.textContent = ""; // Limpa o conteúdo
            }, 1000);
        }
    }, 10000);
}

// Finaliza o jogo
function finalizarJogo(vitoria) {
    clearInterval(temporizador); // Para o temporizador
    alert(vitoria ? "Parabéns! Você venceu!" : "Tempo esgotado! Tente novamente.");
    reiniciarJogo(); // Reinicia o jogo
}

// Reinicia o jogo
function reiniciarJogo() {
    tempoRestante = 60;
    paresCorrespondentes = 0;
    cartasReveladas = [];
    elementoDoTempo.textContent = `Tempo: ${tempoRestante}s`;
    iniciarJogo(); // Inicia um novo jogo
}

// Inicia o jogo ao carregar a página
window.onload = iniciarJogo;