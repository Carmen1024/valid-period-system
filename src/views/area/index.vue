<template>
  <div class="app-container">
    <my-form
      ruleForm="selectArea"
      :formData="formData"
      :formModel="formModel"
      @addFun="addArea"
      @selectFun="selectArea"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateArea'
      ruleForm="addArea"
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
import { areaQuery,areaInsert,areaUpdate,areaValid,areaDelete } from '@/api/area';
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
      formModel: {"_id": "","rg_code": "","rg_name": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid"],
        "#like":["rg_code","rg_name"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },
      formData: [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'rg_code',
          type:"input",
          label:"市级代码"
        },
        {
          prop:'rg_name',
          type:"input",
          label:"省市区"
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
      operateTitle:'新增区域',
      operateModel:{
        "rg_code": "",   //必填，市级代码
        "rg_name": "",  //可选，省市区
        "rg_province": "",  //必填，省
        "rg_city": "",  //必填，市
        "rg_distrct": ""  //必填，区
      },
      operateFormData:[{
          prop:'rg_code',
          type:"input",
          label:"区域名",
          rules:[
            { required: true, message: '请输入区域名', trigger: 'blur' },
          ]
        },{
          prop:'rg_province',
          type:"input",
          label:"省",
          rules:[
            { required: true, message: '请输入省', trigger: 'blur' },
          ]
        },{
          prop:'rg_city',
          type:"input",
          label:"市",
          rules:[
            { required: true, message: '请输入省', trigger: 'blur' },
          ]
        },{
          prop:'rg_distrct',
          type:"input",
          label:"区",
          rules:[
            { required: true, message: '请输入区', trigger: 'blur' },
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
        {type:'rg_code',label:'市级代码',width:200},
        {type:'rg_province',label:'省',width:200},
        {type:'rg_city',label:'市',width:200},
        {type:'rg_distrct',label:'区',width:200},
        {type:'c_create_time',label:'创建时间',width:220},
        {type:'c_valid',label:'状态',switch:true,width:200},
      ],
    }
  },
  mounted() {
    this.selectArea(false);
  },
  methods: {
    // 新增
    addArea(){
      // console.log("响应新增");
      this.operateModel = {
        "rg_code": "",   //必填，市级代码
        "rg_name": "",  //可选，省市区
        "rg_province": "",  //必填，省
        "rg_city": "",  //必填，市
        "rg_distrct": ""  //必填，区
      };
      this.$refs.operateArea.dialogVisible = true;
      this.operateTitle='新增区域';
    },
    editArea(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateArea.dialogVisible = true;
      this.operateTitle='编辑区域id:' + item._id;
    },
    deleteArea(item){
      this.$confirm('确定删除该物料?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          areaDelete(params).then(data => {
            this.selectArea();
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
    switchArea(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      areaValid(params).then(data => {
        // this.selectArea();
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
        this.editArea(item); 
      }
      if(type==='delete'){
        this.deleteArea(item);
      }
      if(type==='switch'){
        this.switchArea(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectArea(false);
    },
    // 搜索
    selectArea(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      areaQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      // console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(){

      let { rg_province,rg_city,rg_distrct } = this.operateModel;
      this.operateModel.rg_name = `${rg_province}省${rg_city}市${rg_distrct}区`;
      // console.log(this.operateModel);
      if(this.operateTitle === '新增区域'){
        areaInsert(this.operateModel).then(data => {
          this.selectArea();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateArea.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["rg_code","rg_name","rg_province","rg_city","rg_distrct"],},this.operateModel);
        areaUpdate(params).then(data => {
          this.selectArea();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateArea.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","rg_code": "","rg_name": "", "createTime": "", "endTime": "", "c_valid": null};
    }

  }
}
</script><style scoped lang='scss'>

</style>
