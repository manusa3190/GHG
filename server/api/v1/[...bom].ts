import { createRouter, defineEventHandler, useBase, readBody } from 'h3'
import { v4 as uuidv4 } from 'uuid';

const materials = {
  paper:{
    name:'紙'
  },
  pp:{
    name:'PP'
  },
  pe:{
    name:'PE'
  },
  pet:{
    name:'PET'
  },
  pork:{
    name:'豚肉'
  },
  cabbage:{
    name:'キャベツ'
  },
  flour:{
    name:'小麦粉'
  }
}

const parts = {
      '1':{
        lineage:[],
        order:1,
        qty:1,
        name:'ギョーザ',        
      },
      '1-1':{
        lineage:['1'],
        order:1,
        qty:12,
        name:'餃子バルク',
      },
      '1-2':{
        lineage:['1'],
        order:2,
        qty:1,
        name:'透明トレイ',
      },
      '1-3':{
        lineage:['1'],
        level:2,
        order:3,
        qty:1,
        name:'ギョーザ 袋',
      },
      '1-1-1':{
        lineage:['1','1-1'],
        order:1,
        qty:1,
        name:'餃子皮',
      },
      '1-1-1-1':{
        lineage:['1','1-1','1-1-1'],
        order:1,
        qty:10,
        name:'小麦粉',
        material:materials['flour'],
      },
      '1-1-2':{
        lineage:['1','1-1'],
        order:2,
        qty:20,
        name:'餃子餡',
      },
      '2':{
        lineage:[],
        order:2,
        qty:1,
        name:'チャーハン',
      }
    }

const router = createRouter()

router.get('/rootItems',defineEventHandler(()=>{
  return Object.entries(parts)
    .filter(([key,data])=>!data.lineage.length)
    .map(([key,data])=>({...data,id:key}))
}))

router.get('/treeItems',defineEventHandler((event)=>{
  const {id}:{id:string} = getQuery(event)
  return Object.entries(parts)
  .filter(([key,data])=>data.lineage.includes(id) || key===id)
  .map(([key,data])=>({...data,id:key}))
}))

router.get('/materialItems',defineEventHandler(()=>{
  return Object.entries(materials).map(([key,data])=>({...data,id:key}))
}))

router.put('/item',defineEventHandler(async event=>{
  const body = await readBody(event)

  body.forEach((part,i) => {
    const {id}:{id:string} = part
    if(id.startsWith('new')){
      delete part.id
      parts[uuidv4()] = part
    }else{
      parts[id] = part
    }
  });
  console.log(body)

  return body
}))

export default useBase('/api/v1/bom', router.handler)