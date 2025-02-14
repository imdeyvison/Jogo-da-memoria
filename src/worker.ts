// worker.ts - Worker responsável por enviar dicas periódicas

// Adiciona um ouvinte para mensagens recebidas do script principal
self.addEventListener('message', (e) => {
    const { type } = e.data; // Extrai o tipo da mensagem

    // Inicia o envio de dicas se o tipo for 'startHints'
    if (type === 'startHints') {
        setInterval(() => {
            self.postMessage({ type: 'hint' }); // Envia uma mensagem de dica a cada 10 segundos
        }, 10000);
    }
});