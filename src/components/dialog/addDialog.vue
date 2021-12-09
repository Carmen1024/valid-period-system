<template>
  <div>
    <!-- <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button> -->

    <el-dialog
      :title="title"
      :visible="dialogVisible"
      :before-close="handleClose"
      :width="width"
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
            :style="item.style"
            >
            <!-- 
              输入框：
              type：input
            -->
            <el-input 
              v-if="item.type==='input'" 
              v-model="formModel[item.prop]"
            ></el-input>
            <el-input 
              v-if="item.type==='textarea'" 
              v-model="formModel[item.prop]"
              type = "textarea"
              :rows="item.rows || 2"
            ></el-input>
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
              天 时 分 选择控件
             -->
            <time-util 
              v-if="item.type==='timeUtil'"
              :id="`${formModel['_id']}_${item.prop}`"
              :propModel="item.prop" 
              :times = "formModel[item.prop]"
              @returnTime = "setRealTime" 
            />
            <!-- 
              下拉框：
              type:select
              options:[{label,value}]
            -->
            <el-select v-if="item.type==='select'" :filterable="item.filterable || false" 
              v-model="formModel[item.prop]" placeholder="请选择" @change="changeModel($event,item.prop)">
              <el-option 
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.label"
                :value="optionItem.value"
                clearable
              >
              </el-option>
            </el-select>
              <!-- 远程搜索 -->
            <el-select
              v-if="item.type==='selectRemote'" 
              v-model="formModel[item.prop]"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option 
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.label || ''" 
                :value="optionItem.value || false"
              ></el-option>
            </el-select>
            <!-- 
            <!-
              选择一个对象
              type:selectItem
            -->
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
            <el-switch 
              v-if="item.type=='switch'" 
              v-model="formModel[item.prop]"
              :active-text="item.activeText || '是'"
              :inactive-text="item.inactiveText || '否'"
              >
            </el-switch>
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
            <!-- 
              多选框
             -->
             <el-checkbox-group v-model="formModel[item.prop]" v-if="item.type==='checkbox'">
              <el-checkbox 
                v-for="item in item.options"
                :label="item.label" 
                :key="item.label"
              >
              </el-checkbox>
            </el-checkbox-group>
            <!-- 多级联动 -->
          <el-cascader
            v-model="formModel[item.prop]" 
            v-if="item.type==='cascader'"
            placeholder="试试搜索：成都"
            :options="item.options"
            :props="item.props"
            @change="blurHandle"
            filterable>
          </el-cascader>
          </el-form-item>
          <el-form-item class="form-handle">
            <!-- <el-button type="primary" @click="selectForm">搜索</el-button>
            <el-button @click="addItem">新增</el-button> -->
            <el-button 
              v-for='item in handles'
              :key=item.type
              :type="item.buttonStyle || ''"
              @click="handle(item.type)">{{item.label}}</el-button>
          </el-form-item>
        </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import timeUtil from '@/components/util/time';
export default {
    components:{
      timeUtil
    },
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
      width: {
        type:String,
        default:'50%'
      },
      handles:{
        type:Array,
        default:()=>[
          {label:"提交",type:"submit",buttonStyle:"primary"},
          {label:"取消",type:"cancel"},
        ]
      },

    },
    data(){
      return {
        dialogVisible:false,
        formRule : {
            
        },
        loading:false,
      }
    },
    watch: {
      // formData 
      // type：
      formData:{
        handler: function (val,oldVal) {
          this.loading = false;
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
        // console.log("我告诉你要保存");
        this.$refs[this.ruleForm].validate((valid) => {
          if (valid) {
            this.$emit("submitFun");
          } else {
            console.log('数据有问题，请重新填入!!');
            return false;
          }
        });
      },
      handle(type){
        if(type === 'submit') this.submitForm();
        else if(type === 'cancel') this.cancel();
        else this.$emit("formHandle",type);
        
      },
      handleClose(){
         this.dialogVisible = false;
      },
      changeModel(data,prop){
        this.$emit("changeModelFun",data,prop);
      },
      setRealTime(prop,time){
        this.formModel[prop] = time;
        // console.log(this.formModel);
      },
      blurHandle(value) {
        // console.log(value);
      },
      remoteMethod(query) {
        // console.log(query);
        if (query !== '') {
          this.loading = true;
          this.$emit("remoteFun",query);
        }
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
      &.largeWidth{
        width: 100%;
      }

    }
    .form-handle{
      width: 100%;
      text-align: right;
    }
  }

</style>