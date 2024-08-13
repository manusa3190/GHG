export default ()=>{
    class MaterialComposition {
        素材名=''
        単位重量=0
        単位=''
    }

    class BuhinData {
        容リ法対象=false
        容リ法分類?=''
        成型製法?=''

        素材構成:MaterialComposition[]=[]
    }

    class Buhin {
        id:string=''
        name:string=''
        lineage:string[]=[]
        type:'buhin'|'component'='buhin'

        qty:number=0
        unit:string=''
        品目区分名:'製品'|'原料'|'資材'|'中間品'|null=null

        buhinData?:BuhinData
        componentId?:string

        constructor(init?: Partial<Buhin>){
            Object.assign(this, init)
        }

        get parent(){
            return this.lineage.at(-1)
        }        

        get isRoot(){
            return !this.lineage.length
        }

        get isTop(){
            return !buhins.value.find(b=>b.id===this.parent)
        }

        get isComponentTop(){
            return this.type==='component'&&this.lineage.length===0
        }

        get isEnd(){
            const children = buhins.value.filter(p=>p.parent===this.id)
            return !children.length
        }
    }

    const buhins = useState<InstanceType<typeof Buhin>[]>('buhins',()=>[])

    const selectedBuhin = useState<InstanceType<typeof Buhin>>('buhin')

    return {Buhin, buhins, selectedBuhin}
}