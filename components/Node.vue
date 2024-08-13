<script setup lang="ts">
import {Handle, Position, type  NodeProps } from '@vue-flow/core'  
import { NodeToolbar } from '@vue-flow/node-toolbar'
import {EllipsisHorizontalIcon} from "@heroicons/vue/24/outline";


const {nodeProps} = defineProps<{nodeProps:NodeProps}>()

const data:Buhin = nodeProps.data

const {Buhin,buhins,selectedBuhin} = useBuhin()

const selectNode =(node:NodeProps)=>{
  selectedBuhin.value = node.data
}

const addNode = async()=>{
  // const buhin:Buhin = nodeProps.data
  const newBuhin = new Buhin({ 
    id:'new'+buhins.value.length,
    lineage: data.lineage.concat([data.id]),
  })
  
  buhins.value.push(newBuhin)
}

const isHover = ref(false)

</script>

<template>
  <div>
    <Handle v-if="!data.isTop" :id="nodeProps.id+'target'" type="target" :position="Position.Left" />

    <div @click="selectNode(nodeProps)"
      :class="[
        ` text-white truncate overflow-hidden hover:cursor-pointer hover:opacity-80`,
        
        data.type==='component'? 'bg-green-800':'bg-indigo-900',        
        
        data.isComponentTop? 'w-[2rem] rounded-r-md'
          :data.componentId? 'w-[8rem] rounded-l-md':'w-[10rem] rounded-md',

        selectedBuhin && selectedBuhin.id===nodeProps.id? 'border-red-500 border-4 py-[0.25rem] px-2':'py-2 px-3'
      ]"
    >{{ nodeProps.data.name|| '名称未設定' }}<p class="text-xs inline">{{  }}</p></div>

    <NodeToolbar :is-visible="!data.isTop" :position="Position.Left">
      <div class="dropdown absolute -left-7 -top-6 ">
        <div tabindex="0" role="button" class="btn btn-ghost btn-xs truncate">{{nodeProps.data.qty + nodeProps.data.unit}}</div>
        <div tabindex="0" class="p-2 rounded shadow menu dropdown-content bg-base-100 flex-row w-32">
          <input v-model="nodeProps.data.qty" class=" input input-ghost input-xs w-12">
          <select v-model="nodeProps.data.unit" class=" select select-ghost select-xs w-16">
            <option v-for="unit of ['g','kg']">{{ unit }}</option>
          </select>
        </div>
      </div>
    </NodeToolbar>    

    <NodeToolbar :is-visible="data.type==='buhin'" :position="Position.Right">
        <div class="dropdown absolute -top-4 right-3 z-50">
          <div tabindex="0" role="button" class="w-6">
            <EllipsisHorizontalIcon class="text-white"></EllipsisHorizontalIcon>
          </div>
          
          <ul tabindex="0" class="dropdown-content menu shadow bg-base-100 rounded-box w-52">
            <li @click="addNode()"><a>アイテム追加</a></li>
            <li><a>コンポーネントから選択</a></li>
            <li><a>コンポーネント登録</a></li>
          </ul>
        </div>
    </NodeToolbar>

    <Handle v-if="!data.isEnd" :id="nodeProps.id+'source'" type="source" :position="Position.Right" />
  </div>
</template>