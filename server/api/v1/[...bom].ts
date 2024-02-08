import { createRouter, defineEventHandler, useBase, readBody } from 'h3'

const materials = {
  niku:{
    name:'ひき肉'
  },
  cabbage:{
    name:'キャベツ'
  },
  flour:{
    name:'小麦粉'
  }
}

const parts = [
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
        id:'1-1-1-1',
        lineage:['1','1-1','1-1-1'],
        order:1,
        qty:10,
        name:'小麦粉',
        material:materials['flour'],
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

router.get('/materials',defineEventHandler(()=>{
  return materials
}))

router.get('/rootItems',defineEventHandler(()=>{
  return parts.filter(m=>!m.lineage.length)
}))

router.get('/treeItems',defineEventHandler((event)=>{
  const {id}:{id:string} = getQuery(event)
  return parts.filter(m=> m.lineage.includes(id) || m.id===id)
}))

router.put('/item',defineEventHandler(async event=>{
  const body = await readBody(event)
  var parent:string;
  body.forEach((part,i) => {
    if(!i)parent = part.lineage.at(-1)
    const index = parts.findIndex(p=>p['id']===part.id)
    parts[index] = part
  });
  return parts.filter(m=> m.lineage.at(-1)===parent)
}))

export default useBase('/api/v1/bom', router.handler)