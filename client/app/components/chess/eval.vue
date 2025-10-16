<script setup>
    let engine = null
    let isEngineLoaded = false
    const fenStore = useFenStore()
    let isEvaluating = false
    let isEvaluationStoped = false
    const evaluationValue = ref(0)

    onMounted(() => {
        const thermometer = document.getElementById('thermometer')
        if (process.client) {
            setupEngine()
        }
    })

    function setupEngine() {
        engine = new Worker('stockfish/stockfish-17.1-single-a496a04.js') // Используем однопоточную версию движка
        engine.addEventListener('message', loadingEngineHandler)
        engine.postMessage('uci')
    }

    function loadingEngineHandler(msg) {
        // Флаг успешной инициализации движка
        if (msg.data === 'uciok') {
            isEngineLoaded = true
            console.log('Engine is loaded')
            engine.removeEventListener('message', loadingEngineHandler)
            engine.addEventListener('message', messageHandling)
        }
    }

    function messageHandling(msg) {
        // Обрабатываем сообщение если оно содержит в себе информацию об оценке позиции
        if (String(msg.data).startsWith('info depth')) {
            const matches = String(msg.data).match(/score (\w*\s.\d*)/i) // Оставляем в строке только оценку позиции
            if (matches) {
                let score = matches[0]
                score = score.split(' ')
                let status = score[1] // Может принимать значение mate или cp в зависимости от статуса игры
                score = parseInt(score[score.length - 1]) // Оценка измеряется в сантипешках либо в ходах оставшихся до мата
                let turn = fenStore.fen.split(' ')[1] == 'b' ? -1 : 1 // Получаем порядок хода из FEN строки
                
                if (status == 'cp') {
                    // Получаем оценку в сантипешках и определяем на какое значение сдвинуть градусник
                    // Если преимущество одной из сторон слишком большое то фиксируем градусник на 95%/5% высоты
                    score = score * turn / 100
                    evaluationValue.value = Math.abs(score)

                    let percent = (score / 10) * 50
                    if (percent >= 50) { percent = 45 }
                    if (percent <= -50) { percent = -45 } 
                    thermometer.style = `height: ${50 - percent}%`
                } else if (status == 'mate') {
                    evaluationValue.value = `# ${Math.abs(score)}`
                    // Проверяем порядок хода и сдвигаем градусник на 100%/0%
                    if (turn == -1 && score < 0 || turn == 1 && score > 0) {
                        thermometer.style = `height: 0%`
                    } else if (turn == -1 && score > 0 || turn == 1 && score < 0) {
                        thermometer.style = `height: 100%`
                    }
                }
            }
        }

        // Т.к. используется однопоточная версия движка необходимо отслеживать окончание работы
        // предыдущего вызова перед тем как проводить следующую оценку позиции
        if (msg.data.split(' ')[0] === 'bestmove') {
            isEvaluating = false
            if (isEvaluationStoped) {
                // Если процесс оценки был прерван то запускаем новую оценку
                isEvaluationStoped = false 
                startEvaluation(fenStore.fen)
            }
        }
    }

    function startEvaluation(fen) {
        // Если предыдущая оценка не завершилась то прерываем её
        if (isEvaluating) {
            isEvaluationStoped = true
            engine.postMessage('stop')
        } else {
            if (isEngineLoaded) {
                try {
                    isEvaluating = true
                    engine.postMessage(`position fen ${fen}`)
                    engine.postMessage(`go depth 18`)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    // Запускаем оценку позиции при каждом изменении состояния доски
    watch(() => fenStore.fen, async () => {
        try {
            startEvaluation(fenStore.fen)
        } catch (e) {
            // При ошибке воркера перезапускаем движок
            console.log(e)
            if (engine) {
                engine.terminate()
            }
            setupEngine()
        }
    })
</script>

<template>
    <div class="eval-wrapper">
        <div class="eval">
            <div class="eval__value">
                <p class="eval__text">
                    {{ evaluationValue }}
                </p>
            </div>
            <div class="eval__thermometer" id="thermometer"></div>
        </div>
    </div>

</template>

<style scoped>
    .eval-wrapper {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .eval {
        transform: translate(4px);
        border-radius: 5px;
        height: 94%;
        width: 50px;
        border: 1px solid #7d7d7d;
        background-color: white;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    }

    .eval__thermometer {    
        bottom: 0;
        background-color: #0a0a0a;
        height: 50%;
        transition: 1s;
    }

    .eval__value {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        width: 100%;
        text-align: center;
        height: 100%;
    }

    .eval__text {
        mix-blend-mode: exclusion;
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
    }


</style>