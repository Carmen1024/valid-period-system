<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPrintTemp"
      :formData="formData"
      :formModel="formModel"
      @addFun="addPrintTemp"
      @selectFun="selectPrintTemp"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operatePrintTemp'
      ruleForm="addPrintTemp"
      :title='operateTitle'
      :formData=operateData
      :formModel=operateModel
      @submitFun="submitForm"
      @changeModelFun="changeModel"
     />
     <!-- 测试打印模板 -->
    <add-dialog 
      ref='testPrintTemp'
      className='testPrintTemp'
      ruleForm="testPrintTemp"
      title="测试打印模板"
      width="30%"
      :formData=testPrintData
      :formModel=testPrintModel
      :handles="testHandles"
      @submitFun="testPrint"
     />
    <my-table 
      :tableData=list 
      :columnList=columnList 
      :handles="handle"
      @handleFun = "handleMethod"
    />
    <pagination
      @pageChangeFun="paginationChange"
      :total="total"
     />

  </div>
</template>

<script>
import myForm from '@/components/myForm';
import addDialog from '@/components/dialog/addDialog';
import myTable from '@/components/myTable';
import pagination from '@/components/pagination';
import { printTempQuery,printTempInsert,printTempUpdate,printTempValid,printTempDelete,printTempTest,printFetchTemp } from '@/api/print';
import { getPageParams,getContent, getDataParams, getPageTotal } from '@/utils/dataParams';

export default {
  components:{
    myForm,
    addDialog,
    myTable,
    pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      // 搜索展示
      formModel: {"_id": "", "createTime": "", "endTime": "", "pt_save_type": null, "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","pt_save_type"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增打印模板',
      operateModel:{pt_save_type:null,pt_desc:"",pt_default:true,pt_text:""},
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'pt_save_type_desc',label:'模板类型'},
        {type:'pt_desc',label:'描述'},
        {type:'c_create_time',label:'创建时间'},
        {type:'pt_default',label:'是否默认',switch:true,activeText:"是",inactiveText:"否"},
        {type:'c_valid',label:'状态',switch:true},
      ],
      handle:[
        {type:'edit',label:'编辑'},
        {label:"打印测试",type:"printTest"},
        {type:'delete',label:'删除'}
      ],
      // 测试打印模板
      fetchTemp:{},
      testPrintModel:{},
      testHandles:[
        {label:"打印",type:"submit",buttonStyle:"primary"},
        {label:"取消",type:"cancel"},
      ],
      testPrintData:[
        {
          prop:'user',
          type:"input",
          style:"width:100%",
          label:"打印机账号",
          rules:[
            { required: true, message: '请填写打印机账号', trigger: 'blur' },
          ],
        },
        {
          prop:'sn',
          type:"input",
          style:"width:100%",
          label:"打印机序列号",
          rules:[
            { required: true, message: '请填写打印机序列号', trigger: 'blur' },
          ],
        },
        {
          prop:'uKey',
          type:"input",
          style:"width:100%",
          label:"打印机密钥",
          rules:[
            { required: true, message: '请填写打印机密钥', trigger: 'blur' },
          ],
        },{
          prop:'callback',
          type:"textarea",
          rows:3,
          style:"width:100%",
          label:"打印返回结果",
          disabled:true,
          placeholder:'打印测试后的结果会展示在这里，不需要输入~'
        }
      ]
    }
  },
  computed:{
    formData:function(){
      return [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'pt_save_type',
          type:"select",
          label:"模板类型",
          options:[
            {label:'质量效期',value:11},{label:'风味效期',value:12}
          ],  
        },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'有效',value:true},{label:'无效',value:false}],
          label:"状态",
        },
        {
          prop:'createTime',
          type:"datetime",
          label:"开始时间",
        },
        {
          prop:'endTime',
          type:"datetime",
          label:"结束时间",
        }
      ]
    },
    operateData:function(){
      return [
        {
          prop:'pt_save_type',
          type:"select",
          label:"模板类型",
          options:[
            {label:'质量效期',value:11},{label:'风味效期',value:12}
          ],
          rules:[
            { required: true, message: '请选择模板类型', trigger: 'blur' },
          ],  
        },
        {
          prop:'pt_desc',
          type:"input",
          label:"模板类型描述",
        },

        {
          prop:"pt_text",
          label:'模板内容',
          type:"textarea",
          rows:5,
          style:"width:100%",
          placeholder:'选择模板类型后，会给您自动填充一段打印模板提示',
          rules:[
            { required: true, message: '请填写模板内容', trigger: 'blur' },
          ],  
        },
        {
          prop:'pt_default',
          label:'是否默认',
          type:"switch",
          activeText:"是",
          inactiveText:"否"
        },
      ]
    },

  },
  mounted(){
    this.selectPrintTemp(false);

  },
  methods: {
    // 获取打印模板
    getPrintFetchTemp(type){
      if(this.fetchTemp[type]) return;
      const params = getDataParams({"#eq":["pt_save_type"]},{pt_save_type:type})
      printFetchTemp(params).then(data=>{
        const { pt_text } = getContent(data);
        this.fetchTemp[type] = pt_text;
        this.operateModel.pt_text = pt_text;
      });
    },
    // 搜索
    selectPrintTemp(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      printTempQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
    },
    // 新增
    addPrintTemp(){
      // console.log("响应新增");
      this.operateModel = {pt_save_type:null,pt_desc:"",pt_default:true,pt_text:""};
      this.$refs.operatePrintTemp.dialogVisible = true;
      this.operateTitle='新增打印模板';
    },
    editPrintTemp(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operatePrintTemp.dialogVisible = true;
      this.operateTitle=`编辑打印模板id: ${item._id}`;
    },
    deletePrintTemp(item){
      this.$confirm('确定删除该打印模板?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          printTempDelete(params).then(data => {
            this.selectPrintTemp();
            this.$message({
              type: 'success',
              message: '删除成功！!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 切换状态
    switchPrintTemp(item,prop){
      // console.log(prop);
      const operateModel = {};
      operateModel["_id"] = item._id;
      operateModel[prop] = item[prop];
      const params = getDataParams({"#eq":["_id"],"#set":[prop]},operateModel);
      // console.log(params);
      if(prop === "c_valid"){
        printTempValid(params).then(data => {
          // this.selectPrintTemp();
          this.$message({
            type: 'success',
            message: '状态切换成功！!'
          });
        })
      }else{
        this.updatePrintTemp(params);
      }
    },
    // 表格操作：编辑 删除 打印测试
    handleMethod(type,item,prop){
      item = JSON.parse(JSON.stringify(item));
      // console.log(type,item);
      if(type==='edit'){
        this.editPrintTemp(item); 
      }
      if(type==='delete'){
        this.deletePrintTemp(item);
      }
      if(type==='switch'){
        this.switchPrintTemp(item,prop);
      }
      if(type === 'printTest'){
        this.setPrintTest(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectPrintTemp(false);
    },
    // 提交
    submitForm(){
      // console.log(this.operateModel);
      if(this.operateTitle === '新增打印模板'){
        printTempInsert(this.operateModel).then(data => {
          this.selectPrintTemp();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operatePrintTemp.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({
            "#eq":["_id"],
            "#set":["pt_desc","pt_default","pt_save_type","pt_text"]
          },this.operateModel);
        this.updatePrintTemp(params);
      }

    },
    updatePrintTemp(params){
      printTempUpdate(params).then(data => {
          this.selectPrintTemp();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operatePrintTemp.dialogVisible = false;
        })
    },
    setPrintTest(item){
      const { pt_text } = item;
      // this.testPrintModel = {user:"yexing@chabaidao.com",sn:"960207139",uKey:"SzvhJq7RMVbFRJxQ",callback:"",pt_text};
      this.testPrintModel = {user:"",sn:"",uKey:"",callback:"",pt_text};
      this.$refs.testPrintTemp.dialogVisible = true;
    },
    testPrint(){
      const { user,sn,uKey,pt_text="" } = this.testPrintModel;
      const testData = { user,sn,uKey,pt_text };
      // console.log(this.testPrintModel,testData);
      printTempTest(testData).then(data => {
          
          this.testPrintModel.callback = getContent(data).result;
          // this.$message({
          //   type: 'success',
          //   message: '修改成功！!'
          // });
          // this.$refs.testPrintTemp.dialogVisible = false;
        })

    },
    changeModel(data,prop){
      if(prop==='pt_save_type'){
        this.getPrintFetchTemp(data);
      }
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "", "createTime": "", "endTime": "", "pt_save_type": null, "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
