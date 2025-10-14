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
        engine = new Worker('stockfish/stockfish-17.1-single-a496a04.js')
        engine.addEventListener('message', loadingEngineHandler)
        engine.postMessage('uci')
    }

    function loadingEngineHandler(msg) {
        if (msg.data === 'uciok') {
            isEngineLoaded = true
            console.log('Engine is loaded')
            engine.removeEventListener('message', loadingEngineHandler)
            engine.addEventListener('message', messageHandling)
        }
    }

    function messageHandling(msg) {
        if (String(msg.data).startsWith('info depth')) {
            const matches = String(msg.data).match(/score (\w*\s.\d*)/i)
            if (matches) {
                let score = matches[0]
                score = score.split(' ')
                let status = score[1]
                score = parseInt(score[score.length - 1])
                let turn = fenStore.fen.split(' ')[1] == 'b' ? -1 : 1
                
                if (status == 'cp') {
                    score = score * turn / 100
                    let percent = 0
                    percent = score / 10 * 50
                    thermometer.style = `height: ${50 - percent}%`
                    evaluationValue.value = Math.abs(score)
                } else if (status == 'mate') {
                    evaluationValue.value = `# ${Math.abs(score)}`
                    if (turn == -1 && score < 0 || turn == 1 && score > 0) {
                        thermometer.style = `height: 0%`
                    } else if (turn == -1 && score > 0 || turn == 1 && score < 0) {
                        thermometer.style = `height: 100%`
                    }
                }
            }
        }

        if (msg.data.split(' ')[0] === 'bestmove') {
            isEvaluating = false
            if (isEvaluationStoped) {
                isEvaluationStoped = false
                startEvaluation(fenStore.fen)
            }
        }
    }

    function startEvaluation(fen) {
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

    watch(() => fenStore.fen, async () => {
        try {
            startEvaluation(fenStore.fen)
        } catch (e) {
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