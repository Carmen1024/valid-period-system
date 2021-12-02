<template>
  <div>
    <!-- <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button> -->

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
            <!-- 
              输入框：
              type：input
            -->
            <el-input v-if="item.type==='input'" v-model="formModel[item.prop]"></el-input>
            <!-- 
              输入框：
              type：input
              数字
            -->
            <el-input v-if="item.type==='number'" style="width:45%;margin-right:10px;"
              v-model.number="formModel[item.prop]">
            </el-input>
            <el-select v-if="item.unitProp" v-model="formModel[item.unitProp]" 
              style="width:30%" placeholder="请选择单位">
              <el-option 
                v-for="(optionItem, optionIndex) in item.unit"
                :key="optionIndex"
                :label="optionItem.label"
                :value="optionItem.value"
                clearable
              >
              </el-option>
            </el-select>
            <!-- 
              下拉框：
              type:select
              options:[{label,value}]
            -->
            <el-select v-if="item.type==='select'" :filterable="item.filterable || false" 
              v-model="formModel[item.prop]" placeholder="请选择">
              <el-option 
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.label"
                :value="optionItem.value"
                clearable
              >
              </el-option>
            </el-select>
            <el-select v-if="item.type==='selectItem'" value-key="value" :filterable="item.filterable || false" 
              v-model="formModel[item.prop]" placeholder="请选择" @change="changeModel($event,item.prop)">
              <el-option 
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.label" 
                :value="optionItem"
                clearable
              >
              </el-option>
            </el-select>
            
            <!-- 
              日期时间：
              type:datetime
              options:[{label,value}]
            -->
            <el-date-picker 
              v-if="item.type==='datetime'"
              v-model="formModel[item.prop]"
              type="datetime"
              :default-time="item.defaultTime || ''"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
            <!-- 
              日期时间：
              type:date
              options:[{label,value}]
            -->
            <el-date-picker 
              v-if="item.type==='date'"
              v-model="formModel[item.prop]"
              type="date"
              :default-time="item.defaultTime || ''"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
export default {
    props: {
      formData: {
        type: Array,
        default: []
      },
      className:{
        type:String,
        default:'demo-ruleForm'
      },
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
        default:''
      },
      formModel: {
        type: Object,
        default: () => {}
      },
      
    },
    data(){
      return {
        dialogVisible:false,
        formRule : {
            
          }
      }
    },
    watch: {
      // formData 
      // type：
      formData:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
      title:{
        handler: function (val,oldVal) {

        },
        deep: true
      },
      formModel :{
        handler: function (val, oldVal) {

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
      submitForm(){
        console.log("我告诉你要保存");
        this.$refs[this.ruleForm].validate((valid) => {
          if (valid) {
            this.$emit("submitFun");
          } else {
            console.log('数据有问题，请重新填入!!');
            return false;
          }
        });
      },
      handleClose(){
         this.dialogVisible = false;
      },
      changeModel(data,prop){
        this.$emit("changeModelFun",data,prop);
      }
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
      .el-input{
        display: inline-block;
      }

    }
  }

</style>