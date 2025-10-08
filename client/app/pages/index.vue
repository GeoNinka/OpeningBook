<script setup>

</script>

<template>
    <div class="main">
        <div class="main__wrapper">
            <theoryDescription class="main__description"></theoryDescription>
            <pgnList class="main__pgn"></pgnList>
            <chessBoard class="main__chess"></chessBoard>
            <movesList class="main__moves"></movesList>
        </div>
    </div>
</template>

<style scoped>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .main__wrapper {
        margin: 0 auto;
        width: 95%;
        height: 95%;
        display: grid;
        grid-template-columns: 1fr 725px 1fr;
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 20px;
    }
    
    .main__description {
        grid-area: 1 / 1 / 2 / 2;
        border: 1px solid #7d7d7d;
        border-radius: 5px 5px 0px 0px;
    }

    .main__pgn {
        grid-area: 2 / 1 / 3 / 2;
        border: 1px solid #7d7d7d;
        border-radius: 0px 0px 5px 5px;
    }

    .main__chess {
        grid-area: 1 / 2 / 3 / 3;
    }

    .main__moves {
        grid-area: 1 / 3 / 3 / 4;
        border: 1px solid #7d7d7d;
        border-radius: 5px;
    }

</style>