<script setup>
    const pgnStore = usePgnStore()

    function moveClickHandler(e) {
        // pgnStore.pgnIndex = lineIndex
        // pgnStore.moveIndex = moveIndex
        // pgnStore.updateGameState()
        console.log(e)
    }
</script>

<template>
    <div class="pgn">
        <ul class="pgn__list">
            <li class="pgn__line" v-for="(line, lineIndex) in pgnStore.pgnList">
                <div class="pgn__move" v-for="(move, moveIndex) in line">
                    {{ move }}
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .pgnList {
        height: 100%;
    }

    .line {
        color: white;
    }


</style>