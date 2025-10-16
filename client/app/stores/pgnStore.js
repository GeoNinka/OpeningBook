export const usePgnStore = defineStore('pgnStore', {
    state: () => ({
        pgnList: [],
        moveIndex: 0,
        pgnIndex: 0,
        flag: false,
    }),
    actions: {
        updateGameState() {
            this.flag = !this.flag
        },

        updatePgnList(pgn) {
            if (!pgn || typeof pgn !== 'string') {
                console.error('Invalid PGN string')
                return 
            }

            let array = this.pgnToArray(pgn)

            if (this.pgnList.length === 0) {
                this.pgnList.push(array.slice())
                this.pgnIndex = 0
                this.moveIndex = array.length
            } else {
                return this.compareArrays(array) 
            }
        },

        pgnToArray(pgn) {
            let splittedPgn = pgn.split(' ')
            let moves = []
            
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

        compareArrays(array) {
            for (let i = 0; i < this.pgnList.length; i++) {
                if (this.isPrefix(array, this.pgnList[i])) {
                    this.pgnIndex = i
                    this.moveIndex = array.length
                    return array.length 
                }

                if (array.length === this.pgnList[i].length + 1 && this.isPrefix(this.pgnList[i], array)) {
                    this.pgnList[i] = array.slice()
                    this.pgnIndex = i
                    this.moveIndex = array.length
                    return 
                }
            }

            this.pgnList.push(array.slice())
            this.pgnIndex = this.pgnList.length - 1
            this.moveIndex = array.length
        },

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