<script setup lang="ts">
    const {data} = await useFetch('/api/v1/boms')

    const items = data.value
</script>

<template>
    <div class=" w-full h-full p-4">
        <h1>テスト</h1>

        <ClientOnly>
            <Chain :items="items"></Chain>            
        </ClientOnly>
    </div>
</template>

<style>
/* import the required styles */
@import "@vue-flow/core/dist/style.css";

/* import the default theme (optional) */
@import "@vue-flow/core/dist/theme-default.css";
</style>