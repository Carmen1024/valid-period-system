<template>
  <div class="app-container">
    <my-form
      ruleForm="selectMaterials"
      :formData="formData"
      :formModel="formModel"
      @addFun="addMaterials"
      @selectFun="selectMaterials"
     />
     <add-form 
      ref='operateMaterials'
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      @submitForm="submitForm"
     />
    <my-table 
      :tableData=list 
      :columnList=columnList 
      @handleMethod = "handleMethod"
    />
  </div>
</template>

<script>
import myForm from '@/components/myForm';
import addForm from '@/components/myForm/addForm';
import myTable from '@/components/myTable';
import { getList } from '@/api/table'

export default {
  components:{
    myForm,
    addForm,
    myTable
  },
  data() {
    return {
      list: null,
      listLoading: true,
      formModel : {ID: '', name: '', sort:null, createTime: '', status: null},
      formData:[
        {
          prop:'ID',
          type:"input",
          label:"ID"
        },
        {
          prop:'name',
          type:"input",
          label:"物料名"
        },
        {
          prop:'sort',
          type:"input",
          label:"归属分类",
          options:[{label:'糖浆',value:0},{label:'奶油',value:1},{label:'芋圆',value:-1}]
        },
        {
          prop:'createTime',
          type:"datetime",
          label:"创建时间",
        },
        {
          prop:'status',
          type:"select",
          options:[{label:'全部',value:0},{label:'有效',value:1},{label:'无效',value:-1}],
          label:"状态",
        }
      ],
      operateTitle:'新增分类',
      operateModel:{name:''},
      operateFormData:[{
          prop:'name',
          type:"input",
          label:"分类名",
          rules:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }],
      list: null,
      columnList:[
        {type:'name',label:'名称'},
        {type:'status',label:'状态'},
        {type:'createTime',label:'创建时间'},
      ]
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取表格数据
    fetchData() {
      getList().then(response => {
        this.list = response.data.items;
      })
    },
    // 新增
    addMaterials(){
      console.log("响应新增，弹出弹框");
      this.$refs.operateMaterials.dialogVisible = true;
      this.operateTitle='新增分类';
    },
    editMaterials(item){
      console.log("响应编辑，弹出弹框");
      this.operateModel = item;
      console.log(item)
      this.$refs.operateMaterials.dialogVisible = true;
      this.operateTitle='编辑分类';
    },
    deleteMaterials(item){
      this.$confirm('确定删除该物料?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 表格操作：编辑 删除
    handleMethod(type,item){
      item = JSON.parse(JSON.stringify(item));
      console.log(type,item);
      if(type==='edit'){
        this.editMaterials(item); 
      }
      if(type==='delete'){
        this.deleteMaterials(item);
      }
    },
    // 搜索
    selectMaterials(selectModel){
      console.log(selectModel);
      console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(model){
      console.log(JSON.parse(JSON.stringify(model)));
      this.$refs.operateMaterials.dialogVisible = false;
      console.log("保存成功！");
      this.$message({
        type: 'success',
        message: '保存成功！!'
      });
    },

  }
}
</script><style scoped lang='scss'>

</style>
