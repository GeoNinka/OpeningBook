export const usePgnStore = defineStore('pgnStore', {
    state: () => ({
        pgnList: [],
        moveIndex: 0,
        pgnIndex: 0,
        flag: false,
    }),
    actions: {
        // Флаг который отслеживается в компоненте с состоянием игры для его обновления при необходимости  
        updateGameState() {
            this.flag = !this.flag
        },

        // 
        updatePgnList(pgn) {
            let array = this.pgnToArray(pgn)

            // Если список ходов пустой то добавляем в него новую последовательность, иначе сравниваем с существующими 
            if (this.pgnList.length === 0) {
                this.pgnList.push(array.slice())
                this.pgnIndex = 0
                this.moveIndex = array.length
            } else {
                return this.compareArrays(array) 
            }
        },

        // Преобразуем PGN строку в массив ходов
        pgnToArray(pgn) {
            let splittedPgn = pgn.split(' ')
            let moves = []
            
            // Получаем массив в формате ["Номер хода. Ход белых", "Ход черных"]
            for (let i = 0; i < splittedPgn.length; i += 3) {
                if (splittedPgn[i]) {
                    moves.push(`${splittedPgn[i]} ${splittedPgn[i + 1]}`)
                    if (splittedPgn[i + 2]) {
                        moves.push(splittedPgn[i + 2])
                    }
                }
            }
            return moves
        },

        // Сравниваем входную последовательность ходов с последовательностями хранящимися в списке чтобы определить, добавить 
        // в список новый массив ходов, обновить один из существующих или сделать один из массивов и его элементов активными. 
        compareArrays(array) {
            for (let i = 0; i < this.pgnList.length; i++) {
                // Если входной массив является подмассивом одной из последовательностей то совпавший массив в 
                // списке и соответствующий ход становятся активными 
                if (this.isPrefix(array, this.pgnList[i])) {
                    this.pgnIndex = i
                    this.moveIndex = array.length
                    return
                }

                // Если входной массив на один элемент длиннее, а одна из последовательностей является его подмассивом,
                // то добавляем в эту последовательность новый ход
                if (array.length === this.pgnList[i].length + 1 && this.isPrefix(this.pgnList[i], array)) {
                    this.pgnList[i] = array.slice()
                    this.pgnIndex = i
                    this.moveIndex = array.length
                    return 
                }
            }

            // Если совпадений не найдено то добавляем в список ходов новую последовательность
            this.pgnList.push(array.slice())
            this.pgnIndex = this.pgnList.length - 1
            this.moveIndex = array.length
        },

        // Проверка является ли первый массив подмассивом второго
        isPrefix(prefix, array) {
            if (prefix.length > array.length) {
                return false
            }
            for (let i = 0; i < prefix.length; i++) {
                if (prefix[i] !== array[i]) {
                    return false
                }
            }
            return true
        },
    },
})