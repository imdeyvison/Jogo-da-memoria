// Array de cartas com pares correspondentes
const cartas = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];

// Variáveis para armazenar as cartas selecionadas e o número de pares encontrados
let primeiraCarta: HTMLElement | null = null;
let segundaCarta: HTMLElement | null = null;
let paresEncontrados = 0;
let cronometro = 60; // Tempo inicial em segundos

// Criação de um worker para gerenciar dicas
const trabalhador = new Worker('worker.js');
trabalhador.postMessage({ tipo: 'iniciarDicas' });

// Escuta mensagens do worker para revelar cartas aleatórias
trabalhador.addEventListener('message', (e) => {
    if (e.data.tipo === 'dica') {
        revelarCartaAleatoria(); // Chama a função para revelar uma carta aleatória
    }
});

// Função para criar o tabuleiro de cartas
function criarTabuleiro() {
    const tabuleiro = document.getElementById('game-board');
    if (tabuleiro) {
        cartas.sort(() => 0.5 - Math.random());
        cartas.forEach(carta => {
            const elementoCarta = document.createElement('div');
            elementoCarta.classList.add('card');
            elementoCarta.dataset.value = carta;
            elementoCarta.innerText = '?';
            elementoCarta.addEventListener('click', () => aoClicarNaCarta(elementoCarta));
            tabuleiro.appendChild(elementoCarta);
        });
    }
}

// Função para revelar uma carta aleatória por 1 segundo
function revelarCartaAleatoria() {
    const tabuleiro = document.getElementById('game-board');
    if (!tabuleiro) return;
    const cartasNaoViradas = Array.from(tabuleiro.children).filter((carta) => (carta as HTMLElement).innerText === '?');
    if (cartasNaoViradas.length === 0) return;

    const cartaAleatoria = cartasNaoViradas[Math.floor(Math.random() * cartasNaoViradas.length)] as HTMLElement;
    cartaAleatoria.innerText = cartaAleatoria.dataset.value || '';
    cartaAleatoria.classList.add('flipped');

    setTimeout(() => {
        cartaAleatoria.innerText = '?';
        cartaAleatoria.classList.remove('flipped');
    }, 1000);
}

// Função para iniciar o cronômetro
function iniciarCronometro() {
    const intervaloCronometro = setInterval(() => {
        cronometro--;
        const elementoCronometro = document.getElementById('timer');
        if (elementoCronometro) {
            elementoCronometro.textContent = `Tempo: ${cronometro}s`;
        }if(paresEncontrados == 4){
            cronometro = 0;
        }
        if (cronometro <= 0) {
            clearInterval(intervaloCronometro);
            if (paresEncontrados === cartas.length / 2) {
                exibirMensagemVitoria();
            } else {
                exibirMensagemDerrota();
            }
        }
    }, 1000);
}

// Função chamada ao clicar em uma carta
function aoClicarNaCarta(elementoCarta: HTMLElement) {
    if (primeiraCarta && segundaCarta) return;

    elementoCarta.innerText = elementoCarta.dataset.value || '';
    elementoCarta.classList.add('flipped');

    if (!primeiraCarta) {
        primeiraCarta = elementoCarta;
    } else if (primeiraCarta && !segundaCarta && elementoCarta !== primeiraCarta) {
        segundaCarta = elementoCarta;
        if (primeiraCarta.dataset.value === segundaCarta.dataset.value) {
            paresEncontrados++;
            resetarCartas();
        } else {
            setTimeout(() => {
                if (primeiraCarta && segundaCarta) {
                    primeiraCarta.innerText = '?';
                    segundaCarta.innerText = '?';
                    primeiraCarta.classList.remove('flipped');
                    segundaCarta.classList.remove('flipped');
                    resetarCartas();
                }
            }, 1000);
        }
    }
}

// Função para resetar as cartas selecionadas
function resetarCartas() {
    primeiraCarta = null;
    segundaCarta = null;
}


function exibirMensagemVitoria() {
    alert('Parabéns! Você ganhou!');
}


function exibirMensagemDerrota() {
    alert('Que pena! Você não conseguiu encontrar todos os pares a tempo.');
}

// Chama o worker para revelar uma carta a cada 10 segundos
setInterval(() => {
    trabalhador.postMessage({ tipo: 'dica' });
}, 10000);

criarTabuleiro(); 
iniciarCronometro(); 