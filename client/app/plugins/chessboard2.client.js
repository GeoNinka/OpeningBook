export default defineNuxtPlugin(async (nuxtApp) => {
    const { Chessboard2 } = await import('@chrisoakman/chessboard2/dist/chessboard2.min.js')
    return {
        provide: {
            chessboard2: Chessboard2
        }
    }
})