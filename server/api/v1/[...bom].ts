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

const buhins:{[key:string]:Buhin} = {
      '1':{
        lineage:[],
        qty:1,
        unit:'製品',
        name:'ギョーザ 一人前',
        type:'buhin'
      },
      '1-1':{
        lineage:['1'],
        qty:12,
        unit:'個',
        name:'餃子バルク',
        componentId:'c1',
        type:'buhin'
      },
      '1-2':{
        lineage:['1'],
        qty:1,
        unit:'枚',
        name:'透明トレイ',
        type:'buhin'
      },
      '1-3':{
        lineage:['1'],
        qty:1,
        unit:'枚',
        name:'ギョーザ 袋',
        type:'buhin'
      },
      'c1':{
        lineage:[],
        name:'餃子バルク',
        qty:1,
        unit:'個',
        type:'component'
      },
      'c1-1':{
        lineage:['c1'],
        qty:1,
        unit:'枚',
        name:'餃子皮',
        type:'component'
      },
      'c1-2':{
        lineage:['c1'],
        qty:20,
        unit:'g',
        name:'餃子餡',
        type:'component'
      },
      '2':{
        lineage:[],
        qty:1,
        unit:'製品',
        name:'ギョーザ 三人前',
        type:'buhin'
      },
      '2-1':{
        lineage:['2'],
        qty:36,
        unit:'個',
        name:'餃子バルク',
        componentId:'c1',
        type:'buhin'
      },
    }

const router = createRouter()

router.get('/rootItems',defineEventHandler(()=>{
  return Object.entries(buhins)
    .filter(([key,data])=>!data.lineage.length && data.type==='buhin')
    .map(([key,data])=>({...data,id:key}))
}))

router.get('/:id',defineEventHandler((event)=>{
  const id = getRouterParam(event,'id')
  if(!id)throw('idが渡されませんでした')

  // buhinを取得
  const idを含む部品 = Object.entries(buhins)
    .filter(([key,data])=>data.lineage.includes(id) || key===id)
    .map(([key,data])=>({...data,id:key}))
  
  console.log(idを含む部品)

  // componentを取得
  const componentList = idを含む部品.flatMap(b=>b.componentId).filter(id=>id)
  const componentIdを含む部品 = Object.entries(buhins)
    .filter(([key,data])=>data.lineage.some(buhinId=>componentList.includes(buhinId)) || componentList.includes(key))
    .map(([key,data])=>({...data,id:key}))

  return idを含む部品.concat(componentIdを含む部品)
}))

router.get('/materialItems',defineEventHandler(()=>{
  return Object.entries(materials).map(([key,data])=>({...data,id:key}))
}))

router.put('/item',defineEventHandler(async event=>{
  const body = await readBody(event)

  body.forEach((buhin,i) => {
    const {id}:{id:string} = buhin
    if(id.startsWith('new')){
      delete buhin.id
      buhins[uuidv4()] = buhin
    }else{
      buhins[id] = buhin
    }
  });
  console.log(body)

  return body
}))

router.delete('/:id',defineEventHandler((event)=>{
  const id = getRouterParam(event,'id')!
  delete buhins[id]
  const targetBuhinIds =  Object.entries(buhins)
    .filter(([key,data])=>data.lineage.includes(id))
    .map(([key,data])=>key)
  targetBuhinIds.forEach(key=>delete buhins[key])

  return 'OK'
}))

export default useBase('/api/v1/bom', router.handler)