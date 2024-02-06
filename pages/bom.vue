<script setup lang="ts">
type ReturnFetchType<T extends string> = ReturnType<
  typeof useFetch<void, unknown, T>
>["data"];

const {data} = await useFetch('/api/v1/boms')

const items = data.value


const material = ref()
async function getMaterial(id:string){
    material.value = await useFetch('/api/v1/boms',{params:{id:id}})
}

async function setMaterial(){

}
</script>

<template>
    <div class=" w-full h-full py-4">
        <h1>テスト</h1>

        <div class=" w-full h-full bg-lime-50 flex ">
            <div class="absolute z-10 w-32 h-full bg-base-100 px-2 flex-none border-r-2">
                <ul>
                    <li v-for=" item of items!.filter(item=>!item.lineage.length)">
                        <div class=" truncate">{{ item['name'] }}</div>
                    </li>
                </ul>
            </div>

            <ClientOnly>
                <Chain :items="items" @selected="getMaterial($event)"></Chain>            
            </ClientOnly>

            <div class=" w-80 flex-none bg-purple-200">
                <div>{{ material }}</div>
            </div>
        </div>


    </div>
</template>

<style>
/* import the required styles */
@import "@vue-flow/core/dist/style.css";

/* import the default theme (optional) */
@import "@vue-flow/core/dist/theme-default.css";
</style>