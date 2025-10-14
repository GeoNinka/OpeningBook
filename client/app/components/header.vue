<template>
    <div class="header">
        <div class="header__github">
            <a href="https://github.com/GeoNinka/OpeningBook" target="_blank" class="header__github-link"> <img class="header__github-icon" src="/images/github-mark-white.png" alt=""> Opening book on GitHub</a>
        </div>
        <div>
            
        </div>
    </div>
</template>

<style scoped>
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 95%;
        margin: 0 auto;
        box-sizing: border-box;
        height: 8vh;
        gap: 20px;
    }

    .header__text {
        font-size: 1.5rem;
        color: #e4e4e4;
    }

    .header__github {
        display: flex;
        align-items: center;
    }

    .header__github-link {
        gap: 20px;
        display: flex;
        align-items: center;
        color: #d0d0d0;
        text-decoration: none;
        font-size: 1.2rem;
    }

    .header__github-icon {
        width: 30px;
        height: 30px;
    }
/* BFBFBF */
</style>