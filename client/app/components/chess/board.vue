<script setup>
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.js'
    import { Chess } from 'chess.js'

    const fenStore = useFenStore()
    let board = null

    const game = new Chess()
    
    onMounted(async () => {
        board = Chessboard2('board', {
            position: 'start',
            draggable: true,
            onDragStart,
            onDrop,
        })
    })  

    function isWhitePiece (piece) { return /^w/.test(piece) }
    function isBlackPiece (piece) { return /^b/.test(piece) }

    function onDragStart(event) {
        if (game.isGameOver()) return false
        if (game.turn() === 'w' && !isWhitePiece(event.piece)) return false
        if (game.turn() === 'b' && !isBlackPiece(event.piece)) return false

        const legalMoves = game.moves({
            square: event.square,
            verbose: true
        })

        legalMoves.forEach((move) => {
            board.addCircle(move.to)
        })
    }

    function onDrop(event) {
        board.clearCircles()
        try {
            let move = game.move({
                from: event.source,
                to: event.target,
                promotion: 'q'
            })
            board.fen(game.fen(), () => fenStore.fen = game.fen())
            let pgn = game.pgn()
            pgn = pgn.split('\n')
            pgn = pgn[pgn.length - 1]
            console.log(pgn)
        } catch (e) {
            return 'snapback'
        }
    }   
</script>

<template>
    <div class="board">
        <div class="board__wrapper">
            <div id="board"></div>
            <ClientOnly>
                <chessEval></chessEval>
            </ClientOnly>
        </div>
        <p class="fen">{{ fenStore.fen }}</p>
    </div>
</template>

<style scoped>
    #board {
        width: calc((100% - 60px));
    }

    .board__wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .fen {
        color: white;
    }
</style>