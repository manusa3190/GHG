<script setup lang="ts">
import { VueFlow,  MarkerType, Position, type Node, type Edge, useVueFlow } from '@vue-flow/core'

const {items} = defineProps<{items:Buhin[]}>()

const nodes = reactive<Node[]>([])

let count = 0
let previousSetNode:Node|null = null

const alreadySetNode = new Set()

const level1s = items?.filter(item=>item.isTop)

level1s?.forEach(item=>setNode(item))

function setNode(Item:Buhin){
    console.log(Item['id'],Item['componentId'])

    const childItems = items!.filter(item=>item.parent===Item['id'])

    if(childItems.length && !Item['componentId']){
        childItems.forEach(childItem=>setNode(childItem))
    }
    
    if(Item['componentId']){
        const componentItem = items.find(item=>item.id===Item['componentId'])
        setNode(componentItem!)
    }

    if(alreadySetNode.has(Item.id))return

    const newNode:Node = {
        id:Item['id'],
        type:'custom',
        label:Item['name'],
        position:{x:210,y:0},
        data:Item,
        parentNode:Item.parent,
    }

    count +=1 ;
    console.log(count,previousSetNode? previousSetNode.data.id:'none', Item.id)

    // y座標を決める。
    if(previousSetNode){
        switch(Item.lineage.length - previousSetNode.data.lineage.length){
            case 1: // 右側に移動した直後のノードの場合
                newNode.position.y = previousSetNode.position.y
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

    if(Item.isComponentTop){
        newNode.parentNode = items.find(item=>item.componentId===Item.id)!.id
        newNode.position.x = 128
        newNode.position.y = 0
    }

    if(items.find(item=>item.id===Item.parent)?.isComponentTop){
        newNode.position.x=100
    }

    nodes.push(newNode)
    
    previousSetNode = newNode

    alreadySetNode.add(Item.id)
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

const {panOnDrag, onNodeDrag, getIntersectingNodes, isNodeIntersecting, getNodes, onMoveEnd} = useVueFlow()

// onNodeDrag(({ intersections }) => {
//   const intersectionIds = intersections.map((intersection) => intersection.id)

//   for (const node of getNodes.value) {
//     const isIntersecting = intersectionIds.includes(node.id)

//     // console.log(node.id, isIntersecting)
//   }
// })

const zoom = ref(1)

onMoveEnd(({event,flowTransform})=>{
    console.log(flowTransform.zoom)
    zoom.value = flowTransform.zoom
})

</script>

<template>
    <div class=" pl-20 pt-4 w-full h-full bg-white">
        <VueFlow :nodes="nodes" :edges="edges" :nodes-draggable="true" >
            <template #node-custom="nodeProps">
                <Node :nodeProps="nodeProps"></Node>
            </template>
        </VueFlow>
    </div>
</template>