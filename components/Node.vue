<script setup lang="ts">
import {Handle, Position, type  NodeProps } from '@vue-flow/core'  
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { PlusCircleIcon } from "@heroicons/vue/24/outline";


const {nodeProps} = defineProps<{nodeProps:NodeProps}>()
  
// console.log(props.data.hello) // 'world'

const addNode=()=>{

}


const isHover = ref(false)
</script>

<template>
  <div>
    <Handle :id="nodeProps.id+'target'" type="target" :position="Position.Left" />
    <div  class=" relative bg-indigo-900 w-32 py-1 px-2 rounded-md text-white overflow-hidden hover:cursor-pointer hover:opacity-80"
    
    >{{ nodeProps.data.name }}</div>

    <NodeToolbar :is-visible="true" :position="Position.Right">
        <div class=" area h-12 w-8 -left-2 -top-6 items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addNode()" class=" plus" :class="isHover? '':'hidden'" />
        </div>
    </NodeToolbar>
    <NodeToolbar :is-visible="true" :position="Position.Bottom">
        <div class=" area h-8 w-8 -left-16 -top-3 place-items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addNode()" class=" plus" :class="isHover? '':'hidden'" />
        </div>
    </NodeToolbar>
    <Handle :id="nodeProps.id+'source'" type="source" :position="Position.Right" />
  </div>
</template>