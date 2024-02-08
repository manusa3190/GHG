<script setup lang="ts">
import { PencilSquareIcon } from "@heroicons/vue/24/outline";
const {Part,parts, selectedPart} = usePart()

const materialOptions = useState('materialOptions')
materialOptions.value = (await useFetch('/api/v1/bom/materialItems')).data.value

const {data} = await useFetch('/api/v1/bom/rootItems')

const rootParts:Part[] = data.value.map(item=>new Part(item))

const getPartsOfTheTree=async(id:string)=>{
    const items = await $fetch('/api/v1/bom/treeItems',{params:{id:id}})
    parts.value = items.map(item=>new Part(item))
}

const isModalOpen = ref(false)
const children = ref<Part[]>([])

const unitOptions = ['kg','g','ml']

const addChild=()=>{
    const parent = selectedPart.value
    const newPart = new Part({
        id:'new'+parent.id+children.value.length,
        lineage:[...parent.lineage,parent.id],
        order:children.value.length+1
    })
    children.value.push(newPart)
}

const editChildren =()=>{
    children.value = JSON.parse(JSON.stringify(
        parts.value.filter(p=>p.parent===selectedPart.value.id)
    ))
    isModalOpen.value = true
    // children.value = structuredClone(parts.value.filter(p=>p.lineage.at(-1)===selectedPart.value.id))
}

const updateChildren=async()=>{
    const updatedParts = await $fetch('/api/v1/bom/item',{method:'put',body:children.value})
    updatedParts.forEach(p=>{
        const index = parts.value.findIndex(p=>p['id']===p.id)
        parts.value[index] = p
    })
    await getPartsOfTheTree(selectedPart.value.id)
    isModalOpen.value = false    
}

</script>

<template>
    <div class=" w-full h-full py-4">
        <h1>テスト</h1>

        <div class=" w-full h-full bg-orange-50 flex ">
            <div class="absolute z-10 h-full bg-base-100 px-2 flex-none border-r-2">
                <div>
                    <input placeholder="ノードを検索">
                </div>

                <ul class="menu">
                    <li v-for=" item of rootParts!.filter(item=>!item.lineage.length)">
                        <div class=" text-lg font-bold truncate" @click="getPartsOfTheTree(item['id'])">{{ item['name'] }}</div>
                    </li>
                </ul>
            </div>

            <ClientOnly>
                <Chain :key="parts.toString()" :items="parts" @selected="Part=$event"></Chain>            
            </ClientOnly>

            <div v-if="selectedPart"  class=" w-64 flex-none bg-base-100 border-l-2 px-2 space-y-6">
                <div>{{ selectedPart.id }}:{{ selectedPart.order }}:{{ selectedPart.material }}</div>
                <div>
                    <h4>品名</h4>
                    <div>{{ selectedPart.name }}</div>
                </div>

                <div>
                    <h4>製法</h4>
                </div>

                <div>
                    <div class="flex justify-between">
                        <h4>素材</h4>

                        <button class="btn btn-ghost btn-xs text-xs" @click="editChildren">
                            <PencilSquareIcon class="w-4"></PencilSquareIcon>編集
                        </button>
                    </div>
                    
                    <table v-if="selectedPart.isEnd" class="table table-sm">
                        <tbody>
                            <tr v-for="c of parts.filter(p=>p.lineage.at(-1)===selectedPart.id)">
                                <td>{{ c.name }}</td>
                                <td>{{ c.qty }}</td>
                                <td>マイクロg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <dialog id="modal" class="modal" :open="isModalOpen">
            <div class="modal-box">
                <ul>
                    <li v-for="(m,i) of children">
                        <input v-model="m.name">
                        <input class="input input-sm input-bordered rounded-none w-12" v-model="m.qty">

                        <select class="select select-xs" v-model="m.unit" >
                            <option v-for="o of unitOptions" :value="o">{{ o }}</option>
                        </select>

                        <select class="select select-xs" v-model="m.material" >
                            <option v-for="m of materialOptions" :value="m.id">{{ m.name }}</option>
                        </select>                        

                        <button class="btn btn-warning btn-xs" @click="children.splice(i,1)">削除</button>
                    </li>

                    <button class="btn btn-primary btn-xs" @click="addChild()">追加</button>
                </ul>

                <div class="modal-action">
                    <button class="btn" @click="updateChildren">更新</button>
                    <button class="btn" @click="isModalOpen=false">キャンセル</button>
                </div>
            </div>
        </dialog>

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