<template>
    <div class="layout">
        <Header></Header>
        <slot />
    </div>
</template>

<style scoped>
    .layout {
        width: 100%;
        height: 100vh;
        background-color: #09090b;
        background-image:  linear-gradient(#111111 0.1px, transparent 1px), linear-gradient(to right, #111111 0.1px, transparent 1px);
        background-size: 30px 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>