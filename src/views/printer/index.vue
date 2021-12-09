<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPrinter"
      :formData="formData"
      :formModel="formModel"
      @addFun="addPrinter"
      @selectFun="selectPrinter"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      width="30%"
      ref='operatePrinter'
      ruleForm="operatePrinter"
      :title='operateTitle'
      :formData=operateData
      :formModel=operateModel
      @submitFun="submitForm"
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
import { printerQuery,printerInsert,printerUpdate,printerValid,printerDelete,printerTest } from '@/api/print';
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
      formModel: {"_id": "", "createTime": "", "endTime": "", "c_valid": null,user:""},
      selectRule: {
        "#eq":["_id","c_valid"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增打印模板',
      operateModel:{user:"",sn:"",uKey:""},
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'user',label:'打印机账号'},
        {type:'sn',label:'打印机序列号'},
        {type:'uKey',label:'打印机密钥'},
        {type:'c_create_time',label:'创建时间'},
        {type:'c_valid',label:'状态',switch:true},
      ],
      operateData:[
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
          prop:'user',
          type:"input",
          label:"打印机账号",
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
          label:"打印机状态",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ],
          rules:[
            { required: true, message: '请选择打印机状态', trigger: 'blur' },
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
          rows:5,
          style:"width:100%",
          rules:[
            { required: true, message: '请填写模板状态', trigger: 'blur' },
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
    this.selectPrinter(false);
  },
  methods: {
    // 搜索
    selectPrinter(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      printerQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
    },
    // 新增
    addPrinter(){
      // console.log("响应新增");
      this.operateModel = {user:"",sn:"",uKey:""};
      this.$refs.operatePrinter.dialogVisible = true;
      this.operateTitle='新增打印机';
    },
    editPrinter(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operatePrinter.dialogVisible = true;
      this.operateTitle=`编辑打印机id: ${item._id},打印机编号：${item.m_code}`;
    },
    deletePrinter(item){
      this.$confirm('确定删除该打印机?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          printerDelete(params).then(data => {
            this.selectPrinter();
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
    switchPrinter(item,prop){
      // console.log(prop);
      let { _id,c_valid } = item;
      const operateModel = { _id,c_valid };
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // if(prop === "c_valid"){
        printerValid(params).then(data => {
          // this.selectPrinter();
          this.$message({
            type: 'success',
            message: '状态切换成功！!'
          });
        })
      // }
    },
    // 表格操作：编辑 删除 打印测试
    handleMethod(type,item,prop){
      item = JSON.parse(JSON.stringify(item));
      // console.log(type,item);
      if(type==='edit'){
        this.editPrinter(item); 
      }
      if(type==='delete'){
        this.deletePrinter(item);
      }
      if(type==='switch'){
        this.switchPrinter(item,prop);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectPrinter(false);
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增打印机'){
        printerInsert(this.operateModel).then(data => {
          this.selectPrinter();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operatePrinter.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({
            "#eq":["_id"],
            "#set":["pt_desc","pt_default","pt_save_type","pt_text"]
          },this.operateModel);
        this.updatePrinter(params);
      }

    },
    updatePrinter(params){
      printerUpdate(params).then(data => {
          this.selectPrinter();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operatePrinter.dialogVisible = false;
        })
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "", "createTime": "", "endTime": "", "c_valid": null,user:""};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
