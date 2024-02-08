<script setup lang="ts">
import { VueFlow,  MarkerType, Position, type Node, type Edge, useVueFlow } from '@vue-flow/core'

const {items} = defineProps<{items:Part[]}>()

const nodes = reactive<Node[]>([])

let previousSetNode:Node|null = null

const level1s = items?.filter(item=>item.isRoot)

level1s?.forEach(item=>setNode(item))

function setNode(Item:Part){

    const childItems = items!.filter(item=>item.parent===Item['id']).sort((a,b)=>a.order-b.order)

    if(childItems.length && !Item.isEnd){
        childItems.forEach(childItem=>setNode(childItem))
    }

    const newNode:Node = {
        id:Item['id'],
        type:'custom',
        label:Item['name'],
        position:{x:200,y:0},
        data:Item,
        parentNode:Item.parent,
    }

    // y座標を決める。
    if(previousSetNode){
        switch(Item.lineage.length - previousSetNode.data.lineage.length){
            case 1: // 右側に移動した直後のノードの場合
                newNode.position.y = previousSetNode.position.y + 60
                break;
            case -1: // 左側に移動した直後のノードの場合
                const childNodes = nodes.filter(node=>node.data.parent===Item['id'])
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

    if(Item.isRoot)newNode.position.y = 30

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
    <div class=" pl-20 pt-4 w-full h-full bg-white">
        <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="false" :default-viewport="{ zoom: 0.8 }" >
            <template #node-custom="nodeProps">
                <Node :nodeProps="nodeProps"></Node>
            </template>
        </VueFlow>                
    </div>
</template>