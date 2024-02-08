export default ()=>{
    const materials = useState<InstanceType<typeof Material>[]>('materials',()=>[])

    const selectedMaterial = useState<InstanceType<typeof Material>>('material')

    class Material {
        id:string=''
        name:string=''
        lineage:string[]=[]
        order:number=0
        qty:number=0
        unit:string=''
        isEnd = false

        constructor(init?: Partial<Material>){
            Object.assign(this, init)
        }

        get parent(){
            return this.lineage.at(-1)
        }

        get level(){
            return this.lineage.length + 1
        }
    }

    return {Material}
}