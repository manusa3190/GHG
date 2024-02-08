import { createRouter, defineEventHandler, useBase } from 'h3'

const materials = [
      {
        id:'1',
        lineage:[],
        order:1,
        qty:1,
        name:'ギョーザ',
        end:false
      },{
        id:'1-1',
        lineage:['1'],
        order:1,
        qty:12,
        name:'餃子バルク',
        end:false
      },{
        id:'1-2',
        lineage:['1'],
        order:2,
        qty:1,
        name:'透明トレイ',
        end:true
      },{
        id:'1-3',
        lineage:['1'],
        level:2,
        order:3,
        qty:1,
        name:'ギョーザ 袋',
        end:true
      },{
        id:'1-1-1',
        lineage:['1','1-1'],
        order:1,
        qty:1,
        name:'餃子皮',
        end:true
      },{
        id:'1-1-2',
        lineage:['1','1-1'],
        order:2,
        qty:20,
        name:'餃子餡',
        end:true
      },{
        id:'2',
        lineage:[],
        order:2,
        qty:1,
        name:'チャーハン',
        end:true
      }
    ]

const router = createRouter()

router.get('/rootItems',defineEventHandler(()=>{
  return materials.filter(m=>!m.lineage.length)
}))

router.get('/treeItems',defineEventHandler((event)=>{
  const {id}:{id:string} = getQuery(event)
  return materials.filter(m=> m.lineage.includes(id) || m.id===id)
}))


export const add = defineEventHandler((event)=>{

})

export default useBase('/api/v1/bom', router.handler)