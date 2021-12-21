<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="50%"
      center>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item 
          v-for="item in descriptions"
          :key="item.type"
          :span="item.span || 1" 
          :label="item.label"
          >
            {{ descriptModel[item.type] }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-for="item in tableList" :key="item.className" :class="item.className">
        <div class="tableTitle">{{item.title}}</div>
        <my-table 
          v-show="item.data"
          :tableData=item.data
          :columnList=item.columnList 
          :handles="[]"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myTable from '@/components/myTable';
export default {
    components:{
      myTable
    },
    props: {
      ruleForm:{
        type:String,
        default:'addForm'
      },
      labelWidth:{
        type:String,
        default:'120px'
      },
      title:{
        type:String,
        default:'展开详情'
      },
      descriptModel: {
        type: Object,
        default: () => {}
      },
      descriptions:{
        type: Array,
        default: () => []
      },
      className:{
        type:String,
        default:''
      },
      tableList:{
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        dialogVisible:false,
        
      }
    },
    watch: {
      title:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
      descriptModel:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
      descriptions:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
      tableList:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
    },
    created() {

    },
    methods: {
      cancel(){
         this.dialogVisible = false;
      },
      handleClose(){
         this.dialogVisible = false;
      },
    }
}
</script>

<style scoped lang='scss'>
  .el-form{

    display: -webkit-flex;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;

    .el-form-item{

      width: 50%;

    }
  }
  .tableTitle{
    margin: 10px;
    text-align: center;
  }

</style>