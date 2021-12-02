<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      :before-close="handleClose"
      width="50%"
      center>
      <el-form 
      :ref='ruleForm' 
      :label-width='labelWidth'
      :class='className'
      :model='formModel'
      :rules="formRule"
      >
        <!-- 
          type:
          label:
          rules:[] 校验规则
          model:
        -->
        <el-form-item 
          v-for="item in formData"
          :key="item.prop" 
          :prop="item.prop"
          :label="item.label || ''" 
          :rules="item.rules"
          >
          </el-form-item>
        </el-form>
      <!-- 这玩意儿tm不支持遍历，先不用了 -->
      <!-- <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item 
          v-for="item in descriptions"
          :key="item.type"
          :span="item.span || 1" 
          :label="item.label"
          >
            {{ descriptModel[item.type] }}
        </el-descriptions-item>
      </el-descriptions> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
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

</style>