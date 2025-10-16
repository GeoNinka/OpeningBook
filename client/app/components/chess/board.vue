<script setup>
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.js'
    import { Chess } from 'chess.js'

    const fenStore = useFenStore()
    const pgnStore = usePgnStore()
    let board = null

    // Board and chess game initilisation
    const game = new Chess()
    onMounted(async () => {
        board = Chessboard2('board', {
            position: 'start',
            draggable: true,
            onDragStart,
            onDrop,
        })
    })  

    // Проверка цвета фигуры на которую нажал пользователь
    function isWhitePiece (piece) { return /^w/.test(piece) }
    function isBlackPiece (piece) { return /^b/.test(piece) }

    function onDragStart(event) {
        // Если игра окончена или цвет фигуры не совпадает с очередью хода завершаем работу функции
        if (game.isGameOver()) return false
        if (game.turn() === 'w' && !isWhitePiece(event.piece)) return false
        if (game.turn() === 'b' && !isBlackPiece(event.piece)) return false

        // Возвращаем массив ходов, которые может совершить выбранная фигура
        // и отрисовываем их на доске
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
            game.move({
                from: event.source,
                to: event.target,
                promotion: 'q'
            })
            board.fen(game.fen(), () => fenStore.fen = game.fen())
            let pgn = game.pgn() // Получаем порядок ходов в формате PGN
            pgn = pgn.split('\n')
            pgn = pgn[pgn.length - 1].slice(0, -2) // Обрезаем всю информацию кроме порядка ходов
            pgnStore.updatePgnList(pgn) // Вырезаем символ * в конце строки
        } catch (e) {
            // Если совершается невозможный ход выбрасывается ошибка и состояние доски откатывается
            return 'snapback'
        }
    }   

    // Отслеживаем изменение состояния списка ходов и обновляем состояние доски с игрой
    watch(() => pgnStore.flag, () => {
        let arr = pgnStore.pgnList[pgnStore.pgnIndex].slice()
        let pgn = arr.slice(0, Math.min(pgnStore.moveIndex, arr.length)).join(' ')
        game.loadPgn(pgn)
        board.fen(game.fen(), () => fenStore.fen = game.fen())
    })
</script>

<template>
    <div class="board">
        <div class="board__wrapper">
            <div id="board"></div>
            <ClientOnly>
                <chessEval></chessEval>
            </ClientOnly>
        </div>
        <ChessControls></ChessControls>
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