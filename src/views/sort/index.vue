<template>
  <div class="app-container">
    <my-form
      ruleForm="selectSort"
      :formData="formData"
      :formModel="formModel"
      @addFun="addSort"
      @selectFun="selectSort"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateSort'
      ruleForm="addSort"
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
     />

  </div>
</template>

<script>
import myForm from '@/components/myForm';
import addDialog from '@/components/dialog/addDialog';
import myTable from '@/components/myTable';
import pagination from '@/components/pagination';
import { classifyQuery,classifyInsert,classifyUpdate,classifyValid,classifyDelete } from '@/api/sort';
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
      formModel: {"_id": "","clf_name": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {"#eq":["_id","c_valid"],"#like":["clf_name"],"#gte":["c_create_time"],"#lte":["c_create_time"]},
      formData: [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'clf_name',
          type:"input",
          label:"分类名"
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
      ],
      // 新增
      operateTitle:'新增分类',
      operateModel:{clf_name:''},
      operateFormData:[{
          prop:'clf_name',
          type:"input",
          style:'width:100%',
          label:"分类名",
          rules:[
            { required: true, message: '请输入分类名', trigger: 'blur' },
          ]
        }],
      // 编辑:
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      list: null,
      columnList:[
        {type:'_id',label:'ID',width:220},
        {type:'clf_name',label:'名称',width:200},
        {type:'c_create_time',label:'创建时间',width:220},
        {type:'c_valid',label:'状态',switch:true,width:200},
      ],
    }
  },
  mounted() {
    this.selectSort(false);
  },
  methods: {
    // 新增
    addSort(){
      // console.log("响应新增");
      this.operateModel = {clf_name:''};
      this.$refs.operateSort.dialogVisible = true;
      this.operateTitle='新增分类';
    },
    editSort(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateSort.dialogVisible = true;
      this.operateTitle='编辑分类id:' + item._id;
    },
    deleteSort(item){
      this.$confirm('确定删除该分类?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          classifyDelete(params).then(data => {
            this.selectSort();
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
    switchSort(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      classifyValid(params).then(data => {
        // this.selectSort();
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
        this.editSort(item); 
      }
      if(type==='delete'){
        this.deleteSort(item);
      }
      if(type==='switch'){
        this.switchSort(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectSort(false);
    },
    // 搜索
    selectSort(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      classifyQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      // console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增分类'){
        classifyInsert(this.operateModel).then(data => {
          this.selectSort();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateSort.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["clf_name"]},this.operateModel);
        classifyUpdate(params).then(data => {
          this.selectSort();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateSort.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","clf_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script><style scoped lang='scss'>

</style>
