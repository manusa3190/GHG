<script setup lang="ts">
import { VueFlow,  MarkerType, Position, type Node, type Edge, useVueFlow } from '@vue-flow/core'

const {items} = defineProps<{items:Material[]}>()

const emits = defineEmits<{
    (e:'selected',val:any):void
}>()

export interface CustomData {
  hello: string
}

export interface CustomEvents {
  onCustomEvent: (event: MouseEvent) => void
}

const nodes = reactive<Node[]>([])

let previousSetNode:Node|null = null

const level1s = items?.filter(item=>item.lineage.length===0)

level1s?.forEach(item=>setNode(item))

function setNode(Item:Material){
    const childItems = items!.filter(item=>item.lineage.at(-1)===Item['id'])

    if(childItems.length){
        childItems.forEach(childItem=>setNode(childItem))
    }

    const newNode:Node = {
        id:Item['id'],
        type:'custom',
        label:Item['name'],
        position:{x:200,y:0},
        data:Item,
        events:{
            'click':()=>useState<Material>('selectedMaterial').value=Item
        },
        parentNode:Item.lineage.at(-1),
    }

    // y座標を決める。
    if(previousSetNode){
        switch(Item.lineage.length - previousSetNode.data.lineage.length){
            case 1: // 右側に移動した直後のノードの場合
                newNode.position.y = previousSetNode.position.y + 60
                break;
            case -1: // 左側に移動した直後のノードの場合
                const childNodes = nodes.filter(node=>node.data.lineage.at(-1)===Item['id'])
                const firstChildNode = childNodes[0]
                newNode.position.y = firstChildNode.position.y
                break;
            case 0: // 同じ階層で、下にノードを追加する場合
                const nodes_copy = nodes.map(n=>n).sort((a,b)=>a.position.y-b.position.y)
                const theBottomNode = nodes_copy.at(-1)
                newNode.position.y = theBottomNode!.position.y + 60
                break
        }
    }

    nodes.push(newNode)
    
    previousSetNode = newNode
}

// エッジを作成
const edges = reactive<Edge[]>([])
nodes.forEach((node,i)=>{
    const children = nodes.filter(n=>n.data.lineage.at(-1)===node['id'])
    children.forEach(childNode=>{
        edges.push({
            id:`${node['id']}-${childNode['id']}`,
            source:node['id'],
            target:childNode['id'],
            type: 'smoothstep'
        })        
    })
})
</script>

<template>
    <div class=" w-full h-full">
        <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="false" :default-viewport="{ zoom: 0.8 }" >
            <template #node-custom="nodeProps">
                <Node :nodeProps="nodeProps"></Node>
            </template>
        </VueFlow>                
    </div>
</template>