<script setup lang="ts">
import {Handle, Position, type  NodeProps } from '@vue-flow/core'  
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { PlusCircleIcon } from "@heroicons/vue/24/outline";


const {nodeProps} = defineProps<{nodeProps:NodeProps}>()

const {Part,parts,selectedPart} = usePart()

const selectNode =(node:NodeProps)=>{
  selectedPart.value = node.data
}

const addNode = async(dir:'child'|'sibling')=>{
  const part:Part = nodeProps.data
  const newPart = new Part({id:'test'+parts.value.length})

  switch(dir){
    case 'child':
      newPart.lineage = [...part.lineage,part.id]
      newPart.order = 1
      // 既にある子たちのorderを一つづつ下げる
      const children = parts.value.filter(p=>p.lineage.at(-1)===part.id)
      children.forEach(c=>c.order=c.order+1)
      break;
    case 'sibling':
      newPart.lineage = part.lineage
      newPart.order = part.order + 1
      break;
  }

  parts.value.push(newPart)
}

const isHover = ref(false)

</script>

<template>
  <div>
    <Handle :id="nodeProps.id+'target'" type="target" :position="Position.Left" />
    <div  class=" relative bg-indigo-900 w-32 py-1 px-2 rounded-md text-white overflow-hidden hover:cursor-pointer hover:opacity-80  "
    :class="{'border-red-500 border-4':selectedPart? selectedPart.id===nodeProps.id:false}"
    @click="selectNode(nodeProps)"
    >{{ nodeProps.data.name || '名称未設定' }}</div>

    <NodeToolbar :is-visible="true" :position="Position.Right">
        <div class=" area h-12 w-8 -left-2 -top-4 items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addNode('child')" class=" plus" :class="isHover? '':'hidden'" />
        </div>
    </NodeToolbar>

    <NodeToolbar :is-visible="!nodeProps.data.isRoot" :position="Position.Bottom">
        <div class=" area h-8 w-28 -left-14 -top-3 place-items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addNode('sibling')" class=" plus" :class="isHover? '':'hidden'" />
        </div>
    </NodeToolbar>

    <NodeToolbar :is-visible="!nodeProps.data.isRoot" :position="Position.Left">
      <div class="dropdown absolute -left-7 -top-6 ">
        <div tabindex="0" role="button" class="btn btn-ghost btn-xs">{{nodeProps.data.qty + nodeProps.data.unit}}</div>
        <div tabindex="0" class="p-2 rounded shadow menu dropdown-content bg-base-100 flex-row w-32">
          <input v-model="nodeProps.data.qty" class=" input input-ghost input-xs w-12">
          <select v-model="nodeProps.data.unit" class=" select select-ghost select-xs w-16">
            <option v-for="unit of ['g','kg']">{{ unit }}</option>
          </select>
        </div>
      </div>
    </NodeToolbar>    
    <Handle :id="nodeProps.id+'source'" type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.area {
    @apply absolute grid
}
.plus {
    @apply w-5 h-5 text-indigo-400 absolute bg-white rounded-full z-10
}
</style>