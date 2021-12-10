<template>
  <div class="app-container">
    <my-form
      ruleForm="selectMaterial"
      :formData="formData"
      :formModel="formModel"
      @addFun="addMaterial"
      @selectFun="selectMaterial"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateMaterial'
      ruleForm="addMaterial"
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
import { materialQuery,materialInsert,materialUpdate,materialValid,materialDelete } from '@/api/material';
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
      formModel: {"_id": "","clf_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","clf_id"],
        "#like":["m_name"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增物料',
      operateModel:{m_name:'',clf_id:''},
      // 表格数据展示
      clfList:[],//物料分类列表
      clfJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'m_code',label:'物料编号'},
        {type:'m_name',label:'物料名称'},
        {type:'clf_name',label:'归属分类'},
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
          prop:'m_name',
          type:"input",
          label:"物料名"
        },
        {
          prop:'clf_id',
          type:"select",
          label:"归属分类",
          options:this.clfList,
          filterable:true,
          props:{"value":'_id',"label":'clf_name'}
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
        prop:'m_name',
        type:"input",
        label:"物料名",
        rules:[
          { required: true, message: '请输入物料名', trigger: 'blur' },
        ]
      },{
        prop:'clf_id',
        type:"select",
        label:"归属分类",
        options:this.clfList,
        filterable:true,
        props:{"value":'_id',"label":'clf_name'},
        rules:[
          { required: true, message: '请选择分类', trigger: 'blur' },
        ]
      }]
    },

  },
  mounted() {
    this.getClfList();
  },
  methods: {
    // 搜索
    selectMaterial(refresh){
      // console.log(refresh);
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      materialQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.clf_name = this.clfJson[item.clf_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 获取归属分类
    getClfList(){
      classifyQueryAll().then(data => {
        // this.clfList = getContent(data);
        this.clfList = getContent(data).map(item => {
          this.clfJson[item._id] = item.clf_name;
          return {value:item._id,label:item.clf_name};
        });
        // resolve();
      }).then(()=>{
        this.selectMaterial(false);
      })
    },
    // 新增
    addMaterial(){
      // console.log("响应新增");
      this.operateModel = {m_name:'',clf_id:''};
      this.$refs.operateMaterial.dialogVisible = true;
      this.operateTitle='新增物料';
    },
    editMaterial(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateMaterial.dialogVisible = true;
      this.operateTitle=`编辑物料id: ${item._id}`;
    },
    deleteMaterial(item){
      this.$confirm('确定删除该物料?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          materialDelete(params).then(data => {
            this.selectMaterial();
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
    switchMaterial(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      materialValid(params).then(data => {
        // this.selectMaterial();
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
        this.editMaterial(item); 
      }
      if(type==='delete'){
        this.deleteMaterial(item);
      }
      if(type==='switch'){
        this.switchMaterial(item);
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectMaterial(false);
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增物料'){
        materialInsert(this.operateModel).then(data => {
          this.selectMaterial();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateMaterial.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["m_name","clf_id"]},this.operateModel);
        materialUpdate(params).then(data => {
          this.selectMaterial();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateMaterial.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","clf_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
