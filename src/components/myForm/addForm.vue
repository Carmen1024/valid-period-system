<template>
  <div>
    <el-form 
      :ref='ruleForm' 
      :label-width='labelWidth'
      :class='className'
      :model='formModel'
      :rules="formRule"
      >
        <!-- <template v-for="(item, index) in formData"> -->
          <!-- 
            type:
            label:
            rules:[]
            model:
          -->
          <el-form-item 
            v-for="(item, index) in formData"
            :key="index" 
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
            <el-select v-if="item.type==='select'" v-model="formModel[item.prop]" placeholder="请选择">
              <el-option 
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.label || ''" 
                :value="optionItem.value || ''"
              >
              </el-option>
            </el-select>
          </el-form-item>
        <!-- </template> -->
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
        default:'120px'
      }
    },
    data(){
      return {
        formModel : {name:'11',name2:'222'},
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
      }
    },
    created() {
      this.formData.map(item=> this.formModel[item.prop] = item.model );
    },
    methods: {
      addItem(){
        console.log("我告诉你要新增");
        this.$emit("addFun");
      },
      selectForm(){
        console.log("我告诉你要搜索");
        const _this = this;
        this.$refs[this.ruleForm].validate((valid) => {
          if (valid) {
            console.log(JSON.stringify(_this.formModel))
            this.$emit("selectFun",JSON.stringify(_this.formModel));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
}
</script>

<style scop lang='scss'>
  .el-form{

    display: -webkit-flex;
    display: flex;

    .el-form-item{

      width: 30%;
      justify-content: space-between;

    }
  }

</style>