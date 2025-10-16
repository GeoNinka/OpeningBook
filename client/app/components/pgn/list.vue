<script setup>
    const pgnStore = usePgnStore()

    function moveClickHandler(e) {
        let moveIndex
        let lineIndex

        pgnStore.pgnIndex = lineIndex
        pgnStore.moveIndex = moveIndex
        pgnStore.updateGameState()
    }
</script>

<template>
    <div class="pgn">
        <ul class="pgn__list">
            <li class="pgn__line" v-for="line in pgnStore.pgnList">
                <div class="pgn__move" v-for="element in line">
                    {{ element }}
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