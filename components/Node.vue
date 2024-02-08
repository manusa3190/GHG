<script setup lang="ts">
import {Handle, Position, type  NodeProps } from '@vue-flow/core'  
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { PlusCircleIcon } from "@heroicons/vue/24/outline";


const {nodeProps} = defineProps<{nodeProps:NodeProps}>()
const {id:selfId,data} = nodeProps

const {Material} = useMaterial()

const materials = useState<InstanceType<typeof Material>[]>('materials')

const addNode = async(lineage:string[],order:number)=>{
  const newMaterial = new Material({
    id:'test'+materials.value.length,
    lineage:lineage,
    order:order,
  })
  materials.value.push(newMaterial)
}

const addChild =async()=> await addNode([...data.lineage,selfId],0)

const addSibling=async()=> await addNode(data.lineage,data.order+1)

const isHover = ref(false)
</script>

<template>
  <div>
    <Handle :id="nodeProps.id+'target'" type="target" :position="Position.Left" />
    <div  class=" relative bg-indigo-900 w-32 py-1 px-2 rounded-md text-white overflow-hidden hover:cursor-pointer hover:opacity-80"
    
    >{{ nodeProps.data.name || '名称未設定' }}</div>

    <NodeToolbar :is-visible="true" :position="Position.Right">
        <div class=" area h-12 w-8 -left-2 -top-4 items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addChild()" class=" plus" :class="isHover? '':'hidden'" />
        </div>
    </NodeToolbar>
    <NodeToolbar :is-visible="true" :position="Position.Bottom">
        <div class=" area h-8 w-28 -left-14 -top-3 place-items-center" @mouseenter="isHover=true" @mouseleave="isHover=false">
            <PlusCircleIcon @click="addSibling()" class=" plus" :class="isHover? '':'hidden'" />
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