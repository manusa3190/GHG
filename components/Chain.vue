<script setup lang="ts">
import { VueFlow,  MarkerType, Position, type Node, type Edge, useVueFlow } from '@vue-flow/core'

const {items} = defineProps<{items}>()

const nodes = reactive<Node[]>([])

let previousSetNode:Node|null = null

const level1s = items?.filter(item=>item['level']===1)

level1s?.forEach(item=>setNode(item))

function setNode(Item){
    const childItems = items!.filter(item=>item['parent']===Item['id'])

    if(childItems.length){
        childItems.forEach(childItem=>setNode(childItem))
    }

    const newNode:Node = {
        id:Item['id'],
        type:(()=>{
            if(!Item['parent'])return 'input'
            if(Item['end'])return 'output'
        })(),
        label:Item['name'],
        sourcePosition: Position.Right,
        targetPosition: Position.Left,        
        position:{x:200,y:0},
        data:Item,
        parentNode:Item['parent'],
        style:{color:'white', font:'menu', backgroundColor:'darkblue', border:'none'}
    }

    // y座標を決める。
    if(previousSetNode){
        switch(Item['level']-previousSetNode.data.level){
            case 1: // 右側に移動した直後のノードの場合
                newNode.position.y = previousSetNode.position.y + 100
                break;
            case -1: // 左側に移動した直後のノードの場合
                const childNodes = nodes.filter(node=>node.data.parent===Item['id'])
                const firstChildNode = childNodes[0]
                newNode.position.y = firstChildNode.position.y
                break;
            case 0: // 同じ階層で、下にノードを追加する場合
                const nodes_copy = nodes.map(n=>n).sort((a,b)=>a.position.y-b.position.y)
                console.log(nodes_copy)
                const theBottomNode = nodes_copy.at(-1)
                newNode.position.y = theBottomNode!.position.y + 100
                break
        }
    }

    nodes.push(newNode)
    
    previousSetNode = newNode
}

// エッジを作成
const edges = reactive<Edge[]>([])
nodes.forEach((node,i)=>{
    const children = nodes.filter(n=>n.data.parent===node['id'])
    children.forEach(childNode=>{
        edges.push({
            id:`${node['id']}-${childNode['id']}`,
            source:node['id'],
            target:childNode['id'],
            type: 'smoothstep'
        })        
    })
})


const {onNodeClick} = useVueFlow()

onNodeClick(({node})=>{
    console.log('clicked',node)
})
</script>

<template>
    <div class="w-full h-full">
        <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="false"  />                
    </div>
</template>