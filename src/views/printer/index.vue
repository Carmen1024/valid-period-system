<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPrinter"
      :formData="formData"
      :formModel="formModel"
      @addFun="addPrinter"
      @selectFun="selectMethod"
      @cancelFun="cancelMethod"
      @remoteFun="getStoreList"
     />
     <add-dialog 
      width="30%"
      ref='operatePrinter'
      ruleForm="operatePrinter"
      :title='operateTitle'
      :formData=operateData
      :formModel=operateModel
      @submitFun="submitForm"
      @remoteFun="getStoreList"
     />
    <my-table 
      :tableData=list 
      :columnList=columnList 
      @handleFun = "handleMethod"
    />
    <pagination
      @pageChangeFun="paginationChange"
      :total="total"
      :page-index="pageIndex"
     />

  </div>
</template>

<script>
import myForm from '@/components/myForm';
import addDialog from '@/components/dialog/addDialog';
import myTable from '@/components/myTable';
import pagination from '@/components/pagination';
import { storeQueryValid } from '@/api/store';
import { printerQuery,printerInsert,printerUpdate,printerValid,printerDelete } from '@/api/print';
import { getPageParams,getContent, getDataParams, getPageTotal, isEmpty } from '@/utils/dataParams';

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
      formModel: {"_id": "", "createTime": "", "endTime": "", "c_valid": null,"s_id":"",pt_status:null},
      selectRule: {
        "#eq":["_id","c_valid","s_id","pt_status"],
        "#like":["s_name"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增打印模板',
      operateModel:{s_id:"",pt_sn:"",pt_key:""},
      storeList:[],
      storeJson:{},
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'s_name',label:'门店名称'},
        {type:'pt_sn',label:'打印机序列号'},
        {type:'pt_key',label:'打印机密钥'},
        {type:'c_create_time',label:'创建时间'},
        {type:'pt_status',label:'在线状态',switchStatus:true,activeText:"在线",inactiveText:"离线"},
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
            prop:'s_id',
            type:"selectRemote",
            label:"所属门店",
            options:this.storeList,
            filterable:true,
        },
        {
          prop:'pt_status',
          type:"select",
          label:'打印机状态',
          options:[{label:'在线',value:1},{label:'离线',value:0}],
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
            prop:'s_id',
            type:"selectRemote",
            label:"所属门店",
            options:this.storeList,
            filterable:true,
            style:"width:100%",
          },
          {
            prop:'pt_sn',
            type:"input",
            style:"width:100%",
            label:"打印机序列号",
            rules:[
              { required: true, message: '请填写打印机序列号', trigger: 'blur' },
            ],
          },
          {
            prop:'pt_key',
            type:"input",
            style:"width:100%",
            label:"打印机密钥",
          }
        ]
    }
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
      this.operateModel = {s_id:"",pt_sn:"",pt_key:""};
      this.$refs.operatePrinter.dialogVisible = true;
      this.operateTitle='新增打印机';
    },
    editPrinter(item){
      // console.log("响应编辑");
      this.operateModel = item;
      this.getStoreList(item.s_name);
      // console.log(item);
      this.$refs.operatePrinter.dialogVisible = true;
      this.operateTitle=`编辑打印机id: ${item._id}`;
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
          this.selectPrinter();
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
        if(prop=='c_valid') this.switchPrinter(item,prop);
        else{
          this.operateModel = item;
          this.submitForm("update")
        };
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
            "#set":["s_id","pt_sn","pt_key","pt_status"]
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
        // 获取归属门店
    getStoreList(name){
      if(isEmpty(name)) return;
      const params = getDataParams({"#like":["s_name"]},{s_name:name});
      storeQueryValid(params).then(data => {
        this.storeList = getContent(data).map(item => {
          this.storeJson[item._id] = item.s_name;
          return {value:item._id,label:item.s_name};
        });
        // resolve();
      })
    },
    selectMethod(){
      //返回到第一页
      this.pageIndex = 1;
      this.selectPrinter();
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "", "createTime": "", "endTime": "", "c_valid": null,"s_id":"",pt_status:null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
