<script setup>
    const pgnStore = usePgnStore()

    function undoMove() {
        if (pgnStore.moveIndex > 0) { 
            pgnStore.moveIndex-- 
            pgnStore.updateGameState()
        }
    }

    function redoMove() {
        if (pgnStore.pgnList[pgnStore.pgnIndex] && pgnStore.moveIndex < pgnStore.pgnList[pgnStore.pgnIndex].length) {
            pgnStore.moveIndex++
            pgnStore.updateGameState()
        }
    }

    function resetGame() {
        if (pgnStore.moveIndex > 0) { 
            pgnStore.moveIndex = 0
            pgnStore.updateGameState()
        }
    }

    function lastMove() {
        if (pgnStore.pgnList[pgnStore.pgnIndex]) {
            pgnStore.moveIndex = pgnStore.pgnList[pgnStore.pgnIndex].length
            pgnStore.updateGameState()
        }
    }
</script>

<template>
    <div>
        <div class="controls__buttons">
            <button @click="resetGame"><<</button>
            <button @click="undoMove"><</button>
            <button @click="redoMove">></button>
            <button @click="lastMove">>></button>
        </div>
    </div>
</template>

<style scoped>

</style>