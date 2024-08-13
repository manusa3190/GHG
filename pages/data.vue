<script setup lang="ts">
import draggable from 'vuedraggable'

const readFile = (files:FileList|null) => {
    if(!files || !files.length)return
    const reader = new FileReader()

    reader.onload = (e)=>{
        console.log(e.target?.result)
    }

    reader.readAsText(files.item(0)!);
}

const items =  [
        {no:1, name:'キャベツ', categoryNo:'1'},
        {no:2, name:'ステーキ', categoryNo:'2'},
        {no:3, name:'リンゴ', categoryNo:'3'}
      ]
</script>

<template>
    <div>データ</div>

    <div>
        <label>
            <div>ファイルを取得</div>
            <input type="file" class="input file-input-info" @change="readFile(($event.target as HTMLInputElement).files)">
        </label>
        
        <button class="btn btn-primary">インポート</button>
    </div>

    <div>
        <!-- <ul>
            <li v-for="item of items">
                <draggable v-model="[item]" item-key="no" tag="ul">
                    <template #item="{ element, index }">
                        <li>{{element.name}}-(No.{{element.no}})</li>
                    </template>
                </draggable>
            </li>
        </ul> -->
    </div>

</template>