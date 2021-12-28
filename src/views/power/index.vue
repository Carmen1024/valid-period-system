<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPower"
      :formData="formData"
      :formModel="formModel"
      @addFun="addPower"
      @selectFun="selectPower"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operatePower'
      ruleForm="addPower"
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
import { powerQuery,powerInsert,powerUpdate,powerValid,powerDelete } from '@/api/role';
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
      operateTitle:'新增权限',
      operateModel:{},
      //权限分类列表
      powerJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'u_name',label:'权限名'},
        {type:'c_desc',label:'权限路径'},
        {type:'c_desc',label:'权限描述'},
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
          label:"权限名"
        },{
          prop:'u_phone',
          type:"input",
          label:"权限路径"
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
        label:"权限名",
        style:'width:100%',
        rules:[
          { required: true, message: '请输入权限名', trigger: 'blur' },
        ]
      },{
        prop:'u_pass',
        type:"input",
        label:"权限路径",
        style:'width:100%',
        rules:[
          { required: true, message: '请输入权限路径', trigger: 'blur' },
        ]
      },{
        prop:'u_phone',
        type:"textarea",
        label:"权限描述",
        style:'width:100%',
      }]
    },

  },
  created() {
    this.selectPower({refresh:false});
  },
  methods: {
    // 搜索
    selectPower(params={}){
      let { refresh=true,newIndex=this.pageIndex } = params;
      this.pageIndex = newIndex;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,--newIndex,refresh);
      // console.log(this.formModel,dataParams);
      powerQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.power_name = this.powerJson[item.power_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 新增
    addPower(){
      // console.log("响应新增");
      this.operateModel = {u_phone:'',u_name:'',u_desc:"",u_pass:""};
      this.$refs.operatePower.dialogVisible = true;
      this.operateTitle='新增权限';
    },
    // 编辑
    editPower(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operatePower.dialogVisible = true;
      this.operateTitle=`编辑权限id: ${item._id}`;
    },
    deletePower(item){
      this.$confirm('确定删除该权限?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          powerDelete(params).then(data => {
            this.selectPower();
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
    switchPower(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      powerValid(params).then(data => {
        // this.selectPower();
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
        this.editPower(item); 
      }
      if(type==='delete'){
        this.deletePower(item);
      }
      if(type==='switch'){
        this.switchPower(item);
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectPower({refresh:false});
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增权限'){
        powerInsert(this.operateModel).then(data => {
          this.selectPower();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operatePower.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["m_name","power_id"]},this.operateModel);
        powerUpdate(params).then(data => {
          this.selectPower();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operatePower.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","power_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
