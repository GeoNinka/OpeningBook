<script setup>
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.js'

    const fenStore = useFenStore()
    let board = useState('board', () => null)
    
    onMounted(async () => {
        board.value = Chessboard2('board', {
            position: 'start',
            draggable: true,
            onChange: changeHandler
        })
    })  

    const changeHandler = () => {
        fenStore.fen = board.value.fen() + ' w' + ' KQkq'
    }
</script>

<template>
    <div class="board">
        <div id="board"></div>
        <p class="fen">{{ fenStore.fen }}</p>
        <ClientOnly>
            <chessEval></chessEval>
        </ClientOnly>
    </div>
</template>

<style scoped>
    #board {
        width: calc((100% - 25px));
    }

    .fen {
        color: white;
    }
</style>