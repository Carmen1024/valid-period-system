<template>
  <div class="table-container">
    <el-table
      :loading=listLoading
      :data=tableData
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      
      <el-table-column
        v-for="(item,index) in columnList"
        :key='item.type + index'
        :prop="item.type"
        :label="item.label"
        :width="item.width || 180" 
        align="center"
        >
          <template slot-scope="scope">
            <!-- 开关 switch-->
            <el-switch 
              v-if="item.switch==true" 
              v-model="scope.row[item.type]"
              active-text='有效'
              inactive-text='无效'
              @change="handle('switch',scope.row)"
              >
            </el-switch>
            <!-- 其他 -->
            <span v-else>
              {{scope.row[item.type]}}
            </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if='handles && handles.length > 0'>
        <template slot-scope="scope">
          <el-button 
            v-for='item in handles'
            :key=item.type
            size="mini"
            @click="handle(item.type,scope.row)">{{item.label}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {

  props:{
    tableData: {
      type:Array,
      default:()=>[]
    },
    columnList: {
      type:Array,
      default:()=>[]
    },
    handles: {
      type:Array,
      default:() => [
        {type:'edit',label:'编辑'},
        {type:'delete',label:'删除'}
      ]
    },
  },
  watch: {
      tableData:{
        handler: function (val, oldVal) {

        },
        deep: true
      }
  },
  data() {
    return {
      listLoading: true
    }
  },
  mounted() {
    this.listLoading = false
  },
  created() {
    
  },
  methods: {
    handle(type,item){
      // console.log(type,index,item);
      this.$emit("handleMethod",type,item);
      
    }
  }
}
</script>
