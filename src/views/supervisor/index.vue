<template>
  <div class="app-container">
    <my-form
      ruleForm="selectSupervisor"
      :formData="formData"
      :formModel="formModel"
      @addFun="importSupervisor"
      @selectFun="selectSupervisor"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateSupervisor'
      ruleForm="addSupervisor"
      width="60%"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      :transferKey="storeName"
      @submitFun="submitForm"
      @resetTransfer="getStoreList"
      @resetTransferByKey="getStoreListByName"
     />
     <add-dialog 
      ref='importSupervisor'
      ruleForm="importSupervisor"
      width="60%"
      title="批量导入用户"
      addDialogTip="督导只能选择有效状态的用户，如查询不到请先到用户管理页面确认用户状态~"
      :formData=userFormData
      :formModel=userModel
      :transferKey="userPhone"
      @submitFun="submitUserForm"
      @resetTransfer="getUserList"
      @resetTransferByKey="getUserListByPhone"
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
import { supervisorQuery,supervisorInsert,supervisorUpdate,supervisorValid,supervisorDelete } from '@/api/supervisor';
import { getPageParams,getContent, getDataParams, getPageTotal } from '@/utils/dataParams';
import { getRegionCode } from '@/utils/region';
import { storeQuery } from '@/api/store';
import { userQuery } from '@/api/user';

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
      formModel: {"_id": "","u_name": "","u_phone":"","reg_id":"", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","reg_id"],
        "#like":["u_name","u_phone"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },
      // 新增
      operateTitle:'编辑督导信息',
      operateModel:{"reg_id":"","s_ids":[]},
      regionList:[],
      // 搜索门店
      storeList:[],
      storeName:"",
      storeIndex:1,
      storeSize:10,
      storeTotal:0,
      // 批量导入用户
      userList:[],
      userModel:{
        "u_ids": [],  //必填，用户ID
      },
      userPhone:"",
      userIndex:1,
      userSize:10,
      userTotal:0,
      // 编辑:
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      list: null,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'u_name',label:'姓名'},
        {type:'u_phone',label:'电话'},
        {type:'reg_name',label:'所属区域'},
        {type:'c_create_time',label:'创建时间'},
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
          prop:'u_name',
          type:"input",
          label:"姓名",
        },
        {
          prop:'u_phone',
          type:"input",
          label:"电话",
        },
        {
          prop:'reg_id',
          type:"cascader",
          label:"所属区域",
          options:this.regionList,
          // filterable:true,
          props:{"value":'_id',"label":'rg_name'},
        },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'启用',value:true},{label:'禁用',value:false}],
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
      ];
    },
    operateFormData:function(){
      return [
        {
          prop:'reg_id',
          type:"cascader",
          label:"所属区域",
          options:this.regionList,
          // filterable:true,
          props:{"value":'_id',"label":'rg_name'},
        },
        {
          prop:'s_ids',
          type:"transferandpage",
          label:"关联门店",
          style:'width:100%',
          options:this.storeList,
          total:this.storeTotal,
          placeholder:'请输入关键字搜索门店，例如：成都',
          transferTip:'只展示分页已选择门店',
          style:"width:100%;",
          unitTip:'已选择门店',
          unit:'家'
        }]
    },
    userFormData:function(){
      return [
        {
          prop:'u_ids',
          type:"transferandpage",
          label:"用户",
          style:'width:100%',
          options:this.userList,
          total:this.userTotal,
          placeholder:'可输入手机号查询用户',
          transferTip:'只展示分页已选择用户',
          style:"width:100%;",
          unitTip:'已选择用户',
          unit:'人'
        }]
      }
  },
  mounted() {
    this.selectSupervisor(false);
    this.getRegionList();
    this.getStoreList();
    this.getUserList();
  },
  methods: {
    // 搜索所属区域代码
    // 获取市级代码
    getRegionList(){
      getRegionCode("").then(data=>{
        this.regionList = data;
      });
    },
    getStoreListByName(val){
      this.storeName = val;
      this.getStoreList();
    },
    getStoreList(storeIndex=this.storeIndex){
      // 搜索
      const selectRule = {"#like":["s_name"]};
      const formModel = {"s_name":this.storeName};
      const dataParams = getPageParams(selectRule,formModel,this.storeSize,--storeIndex,true);
      storeQuery(dataParams).then(data => {
        this.storeList = getContent(data).map(item=>{
          return {key:item._id,label:item.s_name};
        });
        this.storeTotal = getPageTotal(data);
      })
    },
    getUserList(userIndex=this.userIndex){
      const selectRule = {"#eq": ["c_valid"],"#like":["u_phone"]};
      const formModel = {"u_phone":this.userPhone,"c_valid":true};
      const dataParams = getPageParams(selectRule,formModel,this.userSize,--userIndex,true);
      userQuery(dataParams).then(data => {
        this.userList = getContent(data).map(item=>{
          return {key:item._id,label:`${item.u_phone}${item.u_name?' ('+item.u_name+')':''}`};
        });
        this.userTotal = getPageTotal(data);
      })
    },
    getUserListByPhone(val){
      this.userPhone = val;
      this.getUserList();
    },
    //批量导入用户成为督导
    importSupervisor(){
      this.$refs.importSupervisor.dialogVisible = true;
    },
    // 编辑督导
    editSupervisor(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateSupervisor.dialogVisible = true;
      this.operateTitle=`编辑督导（手机号: ${item.u_phone ||''})`;
    },
    deleteSupervisor(item){
      this.$confirm('确定删除该督导?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          supervisorDelete(params).then(data => {
            this.selectSupervisor();
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
    switchSupervisor(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      supervisorValid(params).then(data => {
        // this.selectSupervisor();
        this.$message({
          type: 'success',
          message: '状态切换成功！!'
        });
      })
    },
    // 表格操作：编辑 删除
    handleMethod(type,item){
      item = JSON.parse(JSON.stringify(item));
      // console.log(type,item);
      if(type==='edit'){
        this.editSupervisor(item); 
      }
      if(type==='delete'){
        this.deleteSupervisor(item);
      }
      if(type==='switch'){
        this.switchSupervisor(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectSupervisor(false);
    },
    // 搜索
    selectSupervisor(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      supervisorQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      // console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(){

      let operateModel = this.operateModel
      // 编辑
      const params = getDataParams({
        "#eq":["_id"],
        "#set":["reg_id","s_ids"]
        },operateModel);
      supervisorUpdate(params).then(data => {
        this.selectSupervisor();
        this.$message({
          type: 'success',
          message: '修改成功！!'
        });
        this.$refs.operateSupervisor.dialogVisible = false;
      })

    },
    submitUserForm(){
      console.log(this.userModel);
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","u_name": "","u_phone":"","reg_id":"", "createTime": "", "endTime": "", "c_valid": null};
    }

  }
}
</script><style scoped lang='scss'>

</style>
