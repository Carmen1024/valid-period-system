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
      
      <el-table-column
        v-for="(item,index) in columnList"
        :key='item.type + index'
        :prop="item.type"
        :label="item.label"
        :width="item.width || 150" 
        align="center"
        >
          <template slot-scope="scope">
            <!-- 开关 switch-->
            <el-switch 
              v-if="item.switch==true" 
              v-model="scope.row[item.type]"
              :active-text="item.activeText || '有效'"
              :inactive-text="item.inactiveText || '无效'"
              @change="handle('switch',scope.row,item.type)"
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
    handle(type,item,prop=""){
      // console.log(type,index,item);
      this.$emit("handleFun",type,item,prop);
      
    }
  }
}
</script>
