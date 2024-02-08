export default ()=>{
    class Part {
        id:string=''
        name:string=''
        lineage:string[]=[]
        order:number=0
        qty:number=0
        unit:string=''
        material=null

        constructor(init?: Partial<Part>){
            Object.assign(this, init)
        }

        get isRoot(){
            return !this.lineage.length
        }

        get parent(){
            return this.lineage.at(-1)
        }
    }

    const parts = useState<InstanceType<typeof Part>[]>('parts',()=>[])

    const selectedPart = useState<InstanceType<typeof Part>>('part')

    return {Part, parts, selectedPart}
}