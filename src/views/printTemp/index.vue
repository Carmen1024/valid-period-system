<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPrintTemp"
      :formData="formData"
      :formModel="formModel"
      @addFun="addPrintTemp"
      @selectFun="selectPrintTemp"
     />
     <add-dialog 
      ref='operatePrintTemp'
      ruleForm="addPrintTemp"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      @submitFun="submitForm"
     />
    <my-table 
      :tableData=list 
      :columnList=columnList 
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
import { printTempQuery,printTempInsert,printTempUpdate,printTempValid,printTempDelete } from '@/api/print';
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
        {type:'pt_save_type_desc',label:'物料状态'},
        {type:'pt_desc',label:'描述'},
        {type:'c_create_time',label:'创建时间'},
        {type:'pt_default',label:'是否默认',switch:true,activeText:"是",inactiveText:"否"},
        {type:'c_valid',label:'状态',switch:true},
      ],
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
          label:"物料状态",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ],  
        },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'全部',value:"all"},{label:'有效',value:true},{label:'无效',value:false}],
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
    operateFormData:function(){
      return [
        {
          prop:'pt_save_type',
          type:"select",
          label:"物料状态",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ],  
        },
        {
          prop:'pt_desc',
          type:"input",
          label:"模板描述",
        },

        {
          prop:"pt_text",
          label:'模板内容',
          type:"textarea",
          rows:3,
          style:"width:100%"
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
    this.selectPrintTemp();
  },
  methods: {
    // 搜索
    selectPrintTemp(){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex);
      console.log(this.formModel,dataParams);
      printTempQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
    },
    // 新增
    addPrintTemp(){
      console.log("响应新增");
      this.operateModel = {pt_save_type:null,pt_desc:"",pt_default:true,pt_text:""};
      this.$refs.operatePrintTemp.dialogVisible = true;
      this.operateTitle='新增物料';
    },
    editPrintTemp(item){
      console.log("响应编辑");
      this.operateModel = item;
      console.log(item);
      this.$refs.operatePrintTemp.dialogVisible = true;
      this.operateTitle=`编辑物料id: ${item._id},物料编号：${item.m_code}`;
    },
    deletePrintTemp(item){
      this.$confirm('确定删除该物料?','提示', {
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
      console.log(prop);
      const operateModel = {};
      operateModel["_id"] = item._id;
      operateModel[prop] = item[prop];
      const params = getDataParams({"#eq":["_id"],"#set":[prop]},operateModel);
      console.log(params);
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
    // 表格操作：编辑 删除
    handleMethod(type,item,prop){
      item = JSON.parse(JSON.stringify(item));
      console.log(type,item);
      if(type==='edit'){
        this.editPrintTemp(item); 
      }
      if(type==='delete'){
        this.deletePrintTemp(item);
      }
      if(type==='switch'){
        this.switchPrintTemp(item,prop);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectPrintTemp();
    },
    // 提交
    submitForm(){

      console.log(this.operateModel);
      if(this.operateTitle === '新增物料'){
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
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
