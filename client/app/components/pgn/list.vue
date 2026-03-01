<script setup>
    const pgnStore = usePgnStore()

    const isCurrentMove = computed(() => {
        return (lineIndex, moveIndex) => lineIndex == pgnStore.pgnIndex && pgnStore.moveIndex - 1 == moveIndex
    })

    const isLastLine = computed(() => {
        return (lineIndex) => lineIndex + 1 == pgnStore.pgnList.length
    })

    function moveClickHandler(line, move) {
        pgnStore.pgnIndex = line
        pgnStore.moveIndex = move + 1
        pgnStore.updateGameState()
    }

    function deletePgn(index) {
        pgnStore.deletePgn(index)
        pgnStore.updateGameState()
    }
</script>

<template>
    <div class="pgn">
        <ul class="pgn__list">
            <li class="pgn__line" v-for="(line, lineIndex) in pgnStore.pgnList">
                <div class="pgn__line-wrapper">
                    <div class="pgn__moves">
                        <div 
                            @click="moveClickHandler(lineIndex, moveIndex)" class="pgn__move"
                            :class="{'pgn__move--active': isCurrentMove(lineIndex, moveIndex)}" v-for="(move, moveIndex) in line">
                            {{ move }}
                        </div>
                    </div>
                    <button @click="deletePgn(lineIndex)" class="pgn__delete">
                        <img src="/images/bin.svg" alt="">
                    </button>
                </div>
                <div class="pgn__divider" :class="{'pgn__divider--last': isLastLine(lineIndex)}"/>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .pgn {
        overflow-y: scroll;
    }

    .pgn::-webkit-scrollbar {
        width: 6px;
    }

    .pgn::-webkit-scrollbar-thumb {
        background-color: #7d7d7d;
    }

    .pgn__list {
        display: flex;
        flex-direction: column;
        padding: 0;
        width: 100%;
        margin: 0 auto;
        margin-top: 10px;
        gap: 10px;
    }

    .pgn__line {
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        padding: 5px;
        border-radius: 3px;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .pgn__line-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
    }

    .pgn__divider {
        width: 100%;
        border-bottom: 1px solid #2b2b2b;
        margin: 0 auto;
        margin-top: 10px;
    }

    .pgn__divider--last {
        display: none;
    }

    .pgn__moves {
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .pgn__move {
        color: #c9c9c9;
        cursor: pointer;
        border-bottom: 1px solid #2b2b2b;
        padding: 5px;
        height: 17px;
    }

    .pgn__move:hover {
        border-color: white;
    }

    .pgn__move--active {
        color: white;
        background-color: #2b2b2b;
    }

    .pgn__delete {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: none;
        border: 1px solid #2b2b2b;
        border-radius: 3px;
        cursor: pointer;
    }

    .pgn__delete:hover {
        border-color: #7d7d7d;
    }

    .pgn__delete:active {
        background-color: #ffffff21;
    }
</style>