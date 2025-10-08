<script setup>
    let engine = null
    let isEngineLoaded = false
    const fenStore = useFenStore()
    let isEvaulating = false

    onMounted(() => {
        if (process.client) {
            engine = new Worker('stockfish/stockfish-17.1-single-a496a04.js')
            engine.addEventListener('message', loadingEngineHandler)
            engine.postMessage('uci')
        }
    })

    function loadingEngineHandler(msg) {
        console.log(1)
        if (msg.data === 'uciok') {
            isEngineLoaded = true
            console.log('Engine is loaded')
            engine.removeEventListener('message', loadingEngineHandler)
            engine.addEventListener('message', (msg) => {
                if (msg.data.split(' ')[0] === 'bestmove') {
                    console.log(msg.data)
                }
            })
        }
    }

    watch(() => fenStore.fen, () => {
        if (isEngineLoaded) {
            console.log(fenStore.fen)
            if (isEvaulating) {
                engine.postMessage('stop')
            }
            isEvaulating = true
            engine.postMessage(`position fen ${fenStore.fen}`)
            engine.postMessage(`go depth 18`)
        }
    })
</script>

<template>
    <div>
        
    </div>
</template>

<style scoped>

</style>