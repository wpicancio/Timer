$(document).ready(function () {
    const $timerEl = $('#timer');
    const $marksList = $('#marks-list');
    let intervalId = 0;
    let timer = 0;
    let marks = [];
    let mode = 'cronometro'; // Modos possíveis: 'cronometro' ou 'timer'
    let countdownValue = 0;

    $("#btnCron").click(function() {
        $("#stopwatch").fadeIn();          // Exibe o cronômetro
        mode = 'cronometro';               // Define o modo como cronômetro
        resetTimer();                      // Reseta o cronômetro
        $("#timerInputContainer").hide();  // Esconde o campo de entrada
    
        // Verifica se o ID já foi alterado para 'timerTimer'
        if ($("#timer").attr("id") !== "timer") {
            $("#timer").attr("id", "timer");   // Mantém o id como 'timer' se não foi alterado
        }
    });
    
    $("#btnTimer").click(function() {
        $("#stopwatch").fadeIn();          // Exibe o cronômetro
        mode = 'timer';                    // Define o modo como timer
        resetTimer();                      // Reseta o cronômetro
        $("#timerInputContainer").show();  // Exibe o campo de entrada
    
        // Verifica se o ID é 'timer' antes de alterar para 'timerTimer'
        if ($("#timer").attr("id") !== "timerTimer") {
            $("#timer").attr("id", "timerTimer"); // Altera o id de 'timer' para 'timerTimer'
        }
    });
    
    const formatTime = (time) => {
        const hours = Math.floor(time / 360000);
        const minutes = Math.floor((time % 360000) / 6000);
        const seconds = Math.floor((time % 6000) / 100);
        const hundredths = time % 100;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
    };

    const setTimer = (time) => {
        $timerEl.text(formatTime(time));
    };

    const addMarkToList = (markIndex, markTime) => {
        $marksList.append(`<p>Marca ${markIndex}: ${formatTime(markTime)}</p>`);
    };

    const parseTimerInput = () => {
        const input = $('#timerInput').val();
        const parts = input.split(':');
        let totalCentiseconds = 0;
        
        if (parts.length === 4) { // formato: hh:mm:ss:cc
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;
            const seconds = parseInt(parts[2]) || 0;
            const centiseconds = parseInt(parts[3]) || 0;
            
            totalCentiseconds = hours * 360000 + minutes * 6000 + seconds * 100 + centiseconds;
        } else if (parts.length === 3) { // formato: hh:mm:ss
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;
            const seconds = parseInt(parts[2]) || 0;
            
            totalCentiseconds = hours * 360000 + minutes * 6000 + seconds * 100;
        } else if (parts.length === 2) { // formato: mm:ss
            const minutes = parseInt(parts[0]) || 0;
            const seconds = parseInt(parts[1]) || 0;
            
            totalCentiseconds = minutes * 6000 + seconds * 100;
        } else { // formato: ss
            const seconds = parseInt(input) || 0;
            totalCentiseconds = seconds * 100;
        }
        
        return totalCentiseconds;
    };

    

    $(document).on("keydown", (event) => {
        const isInput = $(event.target).is("input, textarea");
    
        if (event.key === "Enter") {
            event.preventDefault(); // Evita comportamento padrão
    
            if (isInput) {
                // Se estiver digitando no input, inicia o cronômetro
                const $button = $('#power');
                const action = $button.attr('action');
    
                if (action === 'start' || action === 'continue') {
                    // Se a ação for 'start' ou 'continue', inicie o cronômetro
                    toggleTimer();
                }
            } else {
                // Se estiver fora do input, alterna entre play/pause
                toggleTimer();
            }
        } else if (event.key === " ") {
            event.preventDefault();
            toggleTimer();
        }
    });
    
    const toggleTimer = () => {
        const $button = $('#power');
        const action = $button.attr('action');
        
        clearInterval(intervalId); // Para qualquer cronômetro em execução
    
        if (action === 'start' || action === 'continue') {
            if (mode === 'timer') {
                countdownValue = parseTimerInput(); // Pega o valor digitado do input
                if (countdownValue <= 0) {
                    alert('Por favor, insira um tempo válido para o timer.');
                    return;
                }
                timer = countdownValue;
                setTimer(timer); // Atualiza o display
            }
            
            startTimer(); // Inicia o cronômetro
            $button.attr('action', 'pause').html('<i class="fa-solid fa-pause"></i>');
        } else if (action === 'pause') {
            $button.attr('action', 'continue').html('<i class="fa-solid fa-play"></i>');
        }
    };

    const startTimer = () => {
        intervalId = setInterval(() => {
            if (mode === 'cronometro') {
                timer += 1;
            } else { // modo timer
                timer -= 1;
                if (timer <= 0) {
                    timer = 0;
                    clearInterval(intervalId);
                    playSound();
                    resetTimer();
                    return;
                }
            }
            setTimer(timer);
        }, 10);
    };

    const markTime = () => {
        marks.push(timer);
        addMarkToList(marks.length, timer);
    };

    const resetTimer = () => {
        clearInterval(intervalId);
        timer = (mode === 'cronometro') ? 0 : countdownValue;
        marks = [];
        setTimer(timer);
        $marksList.empty();
        $('#power').attr('action', 'start').html('<i class="fa-solid fa-play"></i>');
    };

    const playSound = () => {
        const sound = new Audio("Alermsom.wav"); // Caminho do som
        sound.play();
    }

    $('#power').on('click', toggleTimer);
    $('#mark').on('click', markTime);
    $('#reset').on('click', resetTimer);
});

$(document).on("click", "#fullscreen-toggle", () => {
    if (!document.fullscreenElement &&  // Se não está em tela cheia
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        
        // Tenta entrar em modo tela cheia dependendo do navegador
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }

        // Alterar ícone/texto do botão para indicar que está em tela cheia
        $("#fullscreen-toggle").html('<i class="fa-solid fa-compress"></i> Sair da Tela Cheia');
    } else {
        // Se já está em tela cheia, sai do modo
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }

        // Alterar ícone/texto do botão para indicar que não está mais em tela cheia
        $("#fullscreen-toggle").html('<i class="fa-solid fa-expand"></i> Tela Cheia');
    }
});