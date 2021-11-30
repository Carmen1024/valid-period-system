<template>
  <div class="form-container">
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
            下拉框：
            type:select
            options:[{label,value}]
          -->
          <el-select v-if="item.type==='select'" :filterable="item.filterable || false" 
            v-model="formModel[item.prop]" placeholder="请选择">
            <el-option 
              v-for="(optionItem, optionIndex) in item.options"
              :key="optionIndex"
              :label="optionItem.label || ''" 
              :value="optionItem.value || false"
              clearable
            >
            </el-option>
          </el-select>
          <!-- 
            可搜索的下拉框：
            type:cascader
            options: [{
              value: '0',
              label: '全部',
              children: [{}]
            }]
            -->
          <el-cascader v-if="item.type==='cascader'" v-model="formModel[item.prop]" placeholder="试试模糊搜索"
            :options="item.options" :props="item.props" multiple=false filterable></el-cascader>
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
          <el-button type="primary" @click="selectForm">搜索</el-button>
          <el-button @click="addItem">新增</el-button>
        </el-form-item>
    </el-form>
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
        default:'ruleForm'
      },
      labelWidth:{
        type:String,
        default:()=>'120px'
      },
      formModel: {
        type: Object,
        default: () => {}
      },
    },
    data(){
      return {
        formRule : {
            // name2:[
            //   { required: true, message: '请输入名称', trigger: 'blur' },
            //   { required: true,min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            // ]
          }
      }
    },
    watch: {
      // formData 
      // type：
      formData:{
        handler: function (val, oldVal) {

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
      // this.setFormModel();
    },
    methods: {
      setFormModel(){

      },
      addItem(){
        console.log("我告诉你要新增");
        this.$emit("addFun");
      },
      selectForm(){
        console.log("我告诉你要搜索");
        this.$refs[this.ruleForm].validate((valid) => {
          if (valid) {
            this.$emit("selectFun");
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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

      width: 30%;

    }
  }

</style>