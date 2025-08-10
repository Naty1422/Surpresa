// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA PÁGINA DE BOAS-VINDAS ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const enterButton = document.getElementById('enterButton');

    // Garante que a tela de boas-vindas esteja visível ao carregar.
    if (welcomeScreen) {
        welcomeScreen.classList.add('active'); // Garante que começa visível
    }

    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (welcomeScreen) {
                welcomeScreen.classList.remove('active');
                welcomeScreen.classList.add('hidden'); // Inicia a transição para sumir
            }

            // Após a transição da tela de boas-vindas, mostra o conteúdo principal
            setTimeout(() => {
                if (mainContent) {
                    mainContent.classList.add('active'); // Mostra a página principal
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo
                }
                // CHAMA A FUNÇÃO QUE INICIALIZA TUDO NA PÁGINA PRINCIPAL
                initializeMainPageFunctions();
            }, 1000); // Este tempo deve corresponder à duração da transição CSS de 'welcome-screen'
        });
    }

    // --- VARIÁVEIS GLOBAIS OU ACESSÍVEIS EM TODAS AS FUNÇÕES AUXILIARES ---
    // É importante que essas variáveis sejam declaradas fora de qualquer função
    // para que possam ser acessadas por `initializeMainPageFunctions` E pelas funções auxiliares.
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleButton = document.getElementById('music-toggle');
    const toggleBtn = document.getElementById("toggle-mode");

    // Variáveis do carrossel (declaradas aqui para serem acessíveis pelas funções auxiliares)
    const carouselSlide = document.querySelector('#momentos-inesqueciveis-carrossel .carousel-slide');
    const carouselImages = document.querySelectorAll('#momentos-inesqueciveis-carrossel .carousel-slide img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselContainer = document.querySelector('.carousel-container');

    let counter = 0; // Estado atual do slide do carrossel
    let autoSlideInterval; // Para controlar o setInterval do carrossel

    // Data inicial do relacionamento para o relógio.
    const startDate = new Date('2024-08-27T00:00:00');

    // --- FUNÇÃO PARA INICIALIZAR AS FUNÇÕES DA PÁGINA PRINCIPAL ---
    // Esta função será chamada SOMENTE depois que o botão 'Entrar' for clicado.
    function initializeMainPageFunctions() {
        // --- Modo Noturno Romântico ---
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                document.body.classList.toggle("modo-romantico");
                if (document.body.classList.contains("modo-romantico")) {
                    toggleBtn.textContent = "☀️";
                    toggleBtn.title = "Voltar ao modo claro";
                } else {
                    toggleBtn.textContent = "🌙";
                    toggleBtn.title = "Ativar modo noturno romântico";
                }
            });
        }

        // --- Lógica do Relógio ---
        updateClock(); // Chama a primeira atualização imediatamente
        setInterval(updateClock, 1000); // Inicia a atualização a cada segundo

        // --- Lógica do Carrossel de Fotos ---
        if (carouselSlide && carouselContainer && carouselImages.length > 0) {
            setCarouselWidthAndPosition(); // Define a largura inicial
            startAutoSlide(); // Inicia a troca automática
        }
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval); // Para o auto-slide
                prevSlide();
                startAutoSlide(); // Reinicia o auto-slide
            });
            nextBtn.addEventListener('click', () => {
                clearInterval(autoSlideInterval); // Para o auto-slide
                nextSlide();
                startAutoSlide(); // Reinicia o auto-slide
            });
        }
        window.addEventListener('resize', () => {
            if (carouselSlide) {
                setCarouselWidthAndPosition();
            }
        });

        // --- Efeito de digitação animada ---
        const typingTitles = document.querySelectorAll('.typing-title');
        typingTitles.forEach((el, index) => {
            const fullText = el.textContent;
            el.textContent = '';
            el.style.width = '0'; // Garante que começa invisível, para a animação

            setTimeout(() => {
                let i = 0;
                const interval = setInterval(() => {
                    el.textContent = fullText.slice(0, i + 1);
                    el.style.width = 'auto'; // Permite que a largura se ajuste
                    i++;
                    if (i === fullText.length) {
                        clearInterval(interval);
                        el.style.borderRight = 'none'; // Remove o "cursor"
                    }
                }, 50); // Velocidade da digitação
            }, index * 500); // Atraso para cada título começar a digitar
        });

        // --- Mensagem Romântica Flutuante ---
        setTimeout(mostrarMensagemRomantica, 3000); // Atraso inicial para a primeira mensagem
        setInterval(mostrarMensagemRomantica, 15000); // Exibe uma nova mensagem a cada 15 segundos

        // --- LÓGICA DO PLAYER DE MÚSICA ---
        if (backgroundMusic) {
            backgroundMusic.muted = false; // Desmuta a música
            const playPromise = backgroundMusic.play(); // Tenta reproduzir

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Reprodução iniciada com sucesso
                    if (musicToggleButton) {
                        musicToggleButton.classList.add('active-btn'); // Mostra o botão de controle
                        musicToggleButton.querySelector('i').classList.remove('fa-volume-mute', 'fa-play');
                        musicToggleButton.querySelector('i').classList.add('fa-volume-up');
                    }
                })
                .catch(error => {
                    // A reprodução foi bloqueada (ex: auto-play sem interação)
                    console.warn("A reprodução automática foi impedida ou negada pelo navegador:", error);
                    if (musicToggleButton) {
                        musicToggleButton.classList.add('active-btn'); // Ainda mostra o botão
                        musicToggleButton.innerHTML = '<i class="fas fa-play"></i>'; // Altera o ícone para "Play"
                        backgroundMusic.muted = true; // Mantém mutado se não pôde tocar
                    }
                });
            }
        }

        // --- Listener para o Botão de Controle de Música (Play/Pause) ---
        if (musicToggleButton) {
            musicToggleButton.addEventListener('click', () => {
                if (backgroundMusic.paused) {
                    backgroundMusic.play();
                    musicToggleButton.querySelector('i').classList.remove('fa-volume-mute', 'fa-play');
                    musicToggleButton.querySelector('i').classList.add('fa-volume-up');
                } else {
                    backgroundMusic.pause();
                    musicToggleButton.querySelector('i').classList.remove('fa-volume-up');
                    musicToggleButton.querySelector('i').classList.add('fa-volume-mute');
                }
            });
        }
    } // FIM DA initializeMainPageFunctions()


    // --- FUNÇÕES AUXILIARES (DEFINIDAS NO ESCOPO GLOBAL PARA SEREM ACESSÍVEIS) ---

    function formatNumber(num) {
        return num < 10 ? '0' + num : num;
    }

    function updateClock() {
        // 'startDate' é acessível aqui por ser global
        const now = new Date();
        const difference = now.getTime() - startDate.getTime();

        const timerEl = document.getElementById('countdown-timer');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (difference < 0) {
            if (timerEl) {
                timerEl.innerHTML = 'Aguardando o início do nosso amor...';
            }
            return;
        }

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const displaySeconds = seconds % 60;
        const displayMinutes = minutes % 60;
        const displayHours = hours % 24;

        if (daysEl) daysEl.textContent = formatNumber(days);
        if (hoursEl) hoursEl.textContent = formatNumber(displayHours);
        if (minutesEl) minutesEl.textContent = formatNumber(displayMinutes);
        if (secondsEl) secondsEl.textContent = formatNumber(displaySeconds);
    }

    function setCarouselWidthAndPosition() {
        // As variáveis do carrossel são acessíveis aqui por serem globais
        if (!carouselSlide || !carouselContainer || carouselImages.length === 0) {
            console.warn("Elementos do carrossel não encontrados ou sem imagens.");
            return;
        }

        const totalImages = carouselImages.length;
        // Recalcular a largura para garantir que esteja sempre correta, mesmo após redimensionamento
        let currentSlideWidth = carouselContainer.clientWidth;

        if (currentSlideWidth === 0 && carouselImages[0]) {
            currentSlideWidth = carouselImages[0].offsetWidth;
        }

        if (currentSlideWidth === 0) {
            console.error("Não foi possível determinar a largura do slide. Carrossel pode não funcionar corretamente.");
            return;
        }

        carouselSlide.style.width = (currentSlideWidth * totalImages) + 'px';
        carouselSlide.style.transform = `translateX(${-currentSlideWidth * counter}px)`;
    }

    function nextSlide() {
        // As variáveis do carrossel são acessíveis aqui por serem globais
        if (!carouselSlide || !carouselImages.length || !carouselContainer) return;

        const totalImages = carouselImages.length;
        const currentSlideWidth = carouselContainer.clientWidth;

        counter = (counter + 1) % totalImages;
        carouselSlide.style.transition = "transform 0.5s ease-in-out";
        carouselSlide.style.transform = `translateX(${-currentSlideWidth * counter}px)`;
    }

    function prevSlide() {
        // As variáveis do carrossel são acessíveis aqui por serem globais
        if (!carouselSlide || !carouselImages.length || !carouselContainer) return;

        const totalImages = carouselImages.length;
        const currentSlideWidth = carouselContainer.clientWidth;

        counter = (counter - 1 + totalImages) % totalImages;
        carouselSlide.style.transition = "transform 0.5s ease-in-out";
        carouselSlide.style.transform = `translateX(${-currentSlideWidth * counter}px)`;
    }

    function startAutoSlide() {
        // 'autoSlideInterval' é acessível aqui por ser global
        if (!carouselSlide) return;

        clearInterval(autoSlideInterval); // Limpa qualquer intervalo anterior
        autoSlideInterval = setInterval(nextSlide, 10000); // 10 segundos
    }

    // Mensagens Românticas
    const mensagens = [
        "Você é meu sonho real 💖",
        "Te amo mais a cada segundo ⏳",
        "Nosso amor só cresce 🌱",
        "Obrigada por existir 💫",
        "Estar com você é meu lugar favorito 🏡",
        "Seu sorriso é meu sol ☀️",
        "Seu colo é meu lugar favorito no mundo 🌏"
    ];

    function mostrarMensagemRomantica() {
        const container = document.getElementById("mensagem-romantica");
        if (!container) return;

        container.classList.remove("visivel");

        setTimeout(() => {
            const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
            container.textContent = mensagem;
            container.classList.add("visivel");
        }, 500);
    }

}); // Fim do DOMContentLoaded