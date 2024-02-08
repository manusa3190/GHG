<script setup lang="ts">
const {Material} = useMaterial()

const {data} = await useFetch('/api/v1/bom/rootItems')
const rootMaterials:Material[] = data.value.map(m=>new Material(m))

const materials = useState<Material[]>('materials',()=>[])

const getMaterialsOfTheTree=async(id:string)=>{
    const res:Material[] = await $fetch('/api/v1/bom/treeItems',{params:{id:id}})
    materials.value = res
}


const material = useState<Material | null>('selectedMaterial',()=>null)

</script>

<template>
    <div class=" w-full h-full py-4">
        <h1>テスト</h1>

        <div class=" w-full h-full bg-orange-50 flex ">
            <div class="absolute z-10 w-32 h-full bg-base-100 px-2 flex-none border-r-2">
                <ul>
                    <li v-for=" item of rootMaterials!.filter(item=>!item.lineage.length)">
                        <div class=" truncate" @click="getMaterialsOfTheTree(item['id'])">{{ item['name'] }}</div>
                    </li>
                </ul>
            </div>

            <ClientOnly>
                <Chain :key="materials.toString()" :items="materials" @selected="material=$event"></Chain>            
            </ClientOnly>

            <div class=" w-80 flex-none bg-orange-50 border-l-2 px-2 space-y-6">
                <div>{{ material? material.id:'' }}</div>
                <div>
                    <h4>品名</h4>
                    <div>{{ material? material.name:'' }}</div>
                </div>

                <div>
                    <h4>製法</h4>
                </div>

                <div>
                    <div class="flex justify-between">
                        <h4>素材</h4>
                        <button class=" text-xs">編集</button>
                    </div>
                    
                    <table class="table table-sm">
                        <tbody>
                            <tr>
                                <td>PET</td>
                                <td>10</td>
                                <td>マイクロg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
/* import the required styles */
@import "@vue-flow/core/dist/style.css";

/* import the default theme (optional) */
@import "@vue-flow/core/dist/theme-default.css";

h4 {
    @apply font-bold
}

td {
    @apply text-xs
}
</style>