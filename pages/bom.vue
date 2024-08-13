<script setup lang="ts">
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
const {Buhin,buhins, selectedBuhin} = useBuhin()

const materialOptions = useState('materialOptions')
materialOptions.value = (await useFetch('/api/v1/bom/materialItems')).data.value

const {data} = await useFetch('/api/v1/bom/rootItems')

const rootBuhins:Buhin[] = data.value.map(item=>new Buhin(item))

const getBuhinsOfTheTree=async(id:string)=>{
    const items = await $fetch(`/api/v1/bom/${id}`)
    buhins.value = items.map(item=>new Buhin(item))
}

const isModalOpen = ref(false)
const children = ref<Buhin[]>([])

const unitOptions = ['kg','g','ml']

const addChild=()=>{
    const parent = selectedBuhin.value
    const newBuhin = new Buhin({
        id:'new'+parent.id+children.value.length,
        lineage:[...parent.lineage,parent.id],
        order:children.value.length+1
    })
    children.value.push(newBuhin)
}

const editChildren =()=>{
    children.value = JSON.parse(JSON.stringify(
        buhins.value.filter(p=>p.parent===selectedBuhin.value.id)
    ))
    isModalOpen.value = true
    // children.value = structuredClone(buhins.value.filter(p=>p.lineage.at(-1)===selectedBuhin.value.id))
}

const updateChildren=async()=>{
    const updatedBuhins = await $fetch('/api/v1/bom/item',{method:'put',body:children.value})
    updatedBuhins.forEach(p=>{
        const index = buhins.value.findIndex(p=>p['id']===p.id)
        buhins.value[index] = p
    })
    await getBuhinsOfTheTree(selectedBuhin.value.id)
    isModalOpen.value = false    
}

const deleteBuhins=async()=>{
    const {id} = selectedBuhin.value
    await $fetch(`/api/v1/bom/${id}`,{method:'DELETE'})

    const currentTreeBuhin = buhins.value.find(p=>!p.lineage.length)!
    await getBuhinsOfTheTree(currentTreeBuhin.id)
}

</script>

<template>
    <div class=" w-full h-full ">

        <div class=" w-full h-full bg-orange-50 flex ">
            <div class="absolute z-10 h-full bg-base-100 flex-none border-r-2">
                <div class="flex p-2">
                    <MagnifyingGlassIcon class="w-4"></MagnifyingGlassIcon>
                    <input class=" input input-sm w-32" placeholder="ノードを検索">
                </div>

                <ul class="menu">
                    <li v-for=" item of rootBuhins!.filter(item=>!item.lineage.length)">
                        <div class=" text-lg font-bold truncate" @click="getBuhinsOfTheTree(item['id'])">{{ item['name'] }}</div>
                    </li>
                </ul>
            </div>

            <ClientOnly>
                <Chain :key="buhins.toString()" :items="buhins" @selected="Buhin=$event"></Chain>            
            </ClientOnly>

            <div v-if="selectedBuhin"  class=" flex flex-col w-64 flex-none bg-base-100 border-l-2 px-2 space-y-6">
                <div>{{'id:'+selectedBuhin.id }}、{{'parent:'+ selectedBuhin.parent }}</div>
                <div>
                    <h4>品名</h4>
                    <input v-model="selectedBuhin.name">
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
                    
                    <table v-if="selectedBuhin.isEnd" class="table table-sm">
                        <tbody>
                            <tr v-for="c of buhins.filter(p=>p.lineage.at(-1)===selectedBuhin.id)">
                                <td>{{ c.name }}</td>
                                <td>{{ c.qty }}</td>
                                <td>マイクロg</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex-1"></div>

                <div>

                    <button class="btn btn-primary" @click="selectedBuhin=null">閉じる</button>
                    <button class="btn btn-warning" @click="deleteBuhins">削除</button>
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