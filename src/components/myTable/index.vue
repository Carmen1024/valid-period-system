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
         
        align="center"
        >
          <template slot-scope="scope">
            <!-- 开关 switch-->
            <el-switch 
              v-if="item.switch==true" 
              v-model="scope.row[item.type]"
              :active-text="item.activeText || '有效'"
              :inactive-text="item.inactiveText || '无效'"
              :active-value="true"
              :inactive-value="false"
              @change="handle('switch',scope.row,item.type)"
              >
            </el-switch>
            <el-switch 
              v-else-if="item.switchStatus==true" 
              v-model="scope.row[item.type]"
              :active-text="item.activeText || '有效'"
              :inactive-text="item.inactiveText || '无效'"
              :active-value="1"
              :inactive-value="0"
              @change="handle('switch',scope.row,item.type)"
              >
            </el-switch>
            <!-- 其他 -->
            <span v-else>
              {{scope.row[item.type]}}
            </span>
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        v-if='handles && handles.length > 0'
        :width="handleWidth"
      >
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
      },
      handles:{
        handler: function (val, oldVal) {

        },
        deep: true
      },
  },
  computed:{
    handleWidth:function(){
      const width = this.handles.length * 100;
      console.log(this.handles.length,width);
      return width;
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
      this.$emit("handleFun",type,item,prop);
      
    }
  }
}
</script>
