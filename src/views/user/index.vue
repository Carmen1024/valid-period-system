<template>
  <div class="app-container">
    <my-form
      ruleForm="selectUser"
      :formData="formData"
      :formModel="formModel"
      @addFun="addUser"
      @selectFun="selectMethod"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateUser'
      ruleForm="addUser"
      width="30%"
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
      :page-index="pageIndex"
     />

  </div>
</template>

<script>
import myForm from '@/components/myForm';
import addDialog from '@/components/dialog/addDialog';
import myTable from '@/components/myTable';
import pagination from '@/components/pagination';
import { userQuery,userInsert,userUpdate,userValid,userDelete } from '@/api/user';
import { classifyQueryAll } from '@/api/sort';
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
      formModel: {"_id": "","u_desc":null,"u_name": "","u_phone": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","u_desc"],
        "#like":["u_name","u_phone"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增用户',
      operateModel:{},
      // 表格数据展示
      userList:[],//用户分类列表
      userJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'u_name',label:'用户名'},
        {type:'u_phone',label:'手机号'},
        {type:'c_desc',label:'用户类型'},
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
          label:"用户名"
        },{
          prop:'u_phone',
          type:"input",
          label:"手机号"
        },
        {
          prop:'u_desc',
          type:"select",
          label:"用户类型",
          options:this.userList,
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
    operateFormData:function(){
      return [{
        prop:'u_name',
        type:"input",
        label:"用户名",
        rules:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ]
      },{
        prop:'u_pass',
        type:"input",
        label:"初始密码"
      },{
        prop:'u_phone',
        type:"input",
        label:"手机号",
        rules:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ]
      },{
        prop:'u_desc',
        type:"checkbox",
        label:"用户类型",
        options:this.userList,
        style:"width:100%;height:auto",
        rules:[
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ]
      }]
    },

  },
  created() {
    this.getUserList();
  },
  methods: {
    // 搜索
    selectUser(refresh){
      // console.log(refresh);
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      userQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.user_name = this.userJson[item.user_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 获取归属分类
    getUserList(){
      classifyQueryAll().then(data => {
        // this.userList = getContent(data);
        this.userList = getContent(data).map(item => {
          this.userJson[item._id] = item.user_name;
          return {value:item._id,label:item.user_name};
        });
        // resolve();
      }).then(()=>{
        this.selectUser(false);
      })
    },
    // 新增
    addUser(){
      // console.log("响应新增");
      this.operateModel = {u_phone:'',u_name:'',u_desc:"",u_pass:""};
      this.$refs.operateUser.dialogVisible = true;
      this.operateTitle='新增用户';
    },
    // 编辑
    editUser(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateUser.dialogVisible = true;
      this.operateTitle=`编辑用户id: ${item._id}`;
    },
    deleteUser(item){
      this.$confirm('确定删除该用户?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          userDelete(params).then(data => {
            this.selectUser();
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
    switchUser(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      userValid(params).then(data => {
        // this.selectUser();
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
        this.editUser(item); 
      }
      if(type==='delete'){
        this.deleteUser(item);
      }
      if(type==='switch'){
        this.switchUser(item);
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectUser(false);
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增用户'){
        userInsert(this.operateModel).then(data => {
          this.selectUser();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateUser.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["m_name","user_id"]},this.operateModel);
        userUpdate(params).then(data => {
          this.selectUser();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateUser.dialogVisible = false;
        })
      }

    },
    selectMethod(){
      //返回到第一页
      this.pageIndex = 1;
      this.selectUser();
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","user_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
