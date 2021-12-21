<template>
  <div class="app-container">
    <my-form
      ruleForm="selectRole"
      :formData="formData"
      :formModel="formModel"
      @addFun="addRole"
      @selectFun="selectRole"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateRole'
      ruleForm="addRole"
      width="50%"
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
import { roleQuery,roleInsert,roleUpdate,roleValid,roleDelete } from '@/api/role';
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
      formModel: {"_id": "","c_name":"","c_desc":"","createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid"],
        "#like":["c_name","c_desc"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增角色',
      operateModel:{},
      // 表格数据展示
      powerList:[
        {key:101,label:'/user/query'},
        {key:102,label:'/role/query'},
        {key:103,label:'/power/query'},
      ],//权限列表
      roleJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'c_name',label:'角色名称'},
        {type:'c_desc',label:'角色描述'},
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
          prop:'c_name',
          type:"input",
          label:"角色名"
        },{
          prop:'c_desc',
          type:"input",
          label:"角色描述"
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
        prop:'c_name',
        type:"input",
        label:"角色名",
        style:'width:100%',
        rules:[
          { required: true, message: '请输入角色名', trigger: 'blur' },
        ]
      },{
        prop:'c_desc',
        type:"textarea",
        label:"角色描述",
        style:'width:100%',
      },{
        prop:'c_power',
        type:"transfer",
        label:"角色权限",
        style:'width:100%',
        options:this.powerList,
        style:"width:100%;height:300px",
      }]
    },

  },
  mounted() {
    this.selectRole(false);
    // this.getPowerList();
  },
  methods: {
    // 搜索
    selectRole(refresh){
      // console.log(refresh);
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      roleQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.role_name = this.roleJson[item.role_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 获取权限列表
    getPowerList(){
      classifyQueryAll().then(data => {
        // this.powerList = getContent(data);
        this.powerList = getContent(data).map(item => {
          this.roleJson[item._id] = item.role_name;
          return {key:item._id,label:item.role_name};
        });
        // resolve();
      })
    },
    // 新增
    addRole(){
      // console.log("响应新增");
      this.operateModel = {u_phone:'',c_name:'',u_desc:"",u_pass:""};
      this.$refs.operateRole.dialogVisible = true;
      this.operateTitle='新增角色';
    },
    // 编辑
    editRole(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateRole.dialogVisible = true;
      this.operateTitle=`编辑角色id: ${item._id}`;
    },
    deleteRole(item){
      this.$confirm('确定删除该角色?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          roleDelete(params).then(data => {
            this.selectRole();
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
    switchRole(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      roleValid(params).then(data => {
        // this.selectRole();
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
        this.editRole(item); 
      }
      if(type==='delete'){
        this.deleteRole(item);
      }
      if(type==='switch'){
        this.switchRole(item);
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectRole(false);
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增角色'){
        roleInsert(this.operateModel).then(data => {
          this.selectRole();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateRole.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["m_name","role_id"]},this.operateModel);
        roleUpdate(params).then(data => {
          this.selectRole();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateRole.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","role_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
