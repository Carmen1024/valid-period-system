<template>
  <div class="app-container">
    <my-form
      ruleForm="selectStore"
      :formData="formData"
      :formModel="formModel"
      @addFun="addStore"
      @selectFun="selectStore"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateStore'
      ruleForm="addStore"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      @submitFun="submitForm"
      @changeModelFun="changeModel"
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
import { storeQuery,storeInsert,storeUpdate,storeValid,storeDelete } from '@/api/store';
import { classifyQueryAll } from '@/api/sort';
import { getPageParams,getContent, getDataParams, getPageTotal } from '@/utils/dataParams';
import { getRegionCode } from '@/utils/region';

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
      formModel: {
        "_id": "",
        "s_name": "",  //可选，门店名称
        "s_code": "",  //可选，门店编码
        "s_short_code": "",  //可选，门店简码
        "s_addr":"",//门店地址
        "createTime": "", "endTime": "", "c_valid": null
      },
      selectRule: {
        "#eq":["_id","c_valid"],
        "#like":[
          "s_name","s_code","s_short_code","s_addr"
        ],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },
      
      // 新增
      operateTitle:'新增门店',
      operateModel:{},
      // 编辑:
      // 表格数据展示
      RegionCodeList:[],//物料分类列表
      regionCodeJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      list: null,
      columnList:[
        {type:'_id',label:'ID',width:220},
        {type:'s_city_code',label:'市级代码'},
        {type:'s_code',label:'门店编码'},
        {type:'s_short_code',label:'门店简码'},
        {type:'s_name',label:'门店名称'},
        {type:'s_addr',label:'门店地址'},
        {type:'c_create_time',label:'创建时间',width:220},
        {type:'c_valid',label:'状态',switch:true},
      ],
    }
  },
  computed:{
    formData: function(){
      return [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        // {
        //   prop:'s_city_code',
        //   type:"select",
        //   label:"市级代码",
        //   options:this.RegionCodeList,
        //   filterable:true,
        //   props:{"value":'rg_code',"label":'rg_name'},
        // },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'有效',value:true},{label:'无效',value:false}],
          label:"状态",
        },
        {
          prop:'s_name',
          type:"input",
          label:"门店名称"
        },
        {
          prop:'s_code',
          type:"input",
          label:"门店编码"
        },
        {
          prop:'s_short_code',
          type:"input",
          label:"门店简码"
        },
        {
          prop:'s_addr',
          type:"input",
          label:"门店地址"
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
          prop:'s_name',
          type:"input",
          label:"门店名称",
          rules:[
            { required: true, message: '请输入门店名称', trigger: 'blur' },
          ]
        },
        {
          prop:'s_code',
          type:"input",
          label:"门店编码",
          rules:[
            { required: true, message: '请输入门店编码', trigger: 'blur' },
          ]
        },
        {
          prop:'s_short_code',
          type:"input",
          label:"门店简码",
          rules:[
            { required: true, message: '请输入门店简码', trigger: 'blur' },
          ]
        },
        {
          prop:'s_city_code',
          type:"select",
          label:"省市区",
          options:this.RegionCodeList,
          filterable:true,
          props:{"value":'rg_code',"label":'rg_name'},
          rules:[
            { required: true, message: '请选择省市区', trigger: 'change' },
          ]
        },
        {
          prop:'s_addr',
          type:"input",
          label:"门店地址",
          style:"width:100%;"
        }]
    },
  },
  mounted() {
    this.getRegionCodeList();
    this.selectStore(false);

  },
  methods: {
    // 获取市级代码
    getRegionCodeList(){
      getRegionCode("").then(data=>{
        // console.log(data);
        this.RegionCodeList = data;
        data.map(item=>{
        //   "s_province": "",  //必填，省
        // "s_city": "",  //必填，市
        // "s_district": "",  //必填，区
          const { rg_province,rg_city,rg_distrct } = item;
          this.regionCodeJson[item.rg_code] ={
              s_province:rg_province,
              s_city:rg_city,
              s_district:rg_distrct
            };
        })
        // console.log(this.regionCodeJson);
      });
    },
    // 新增
    addStore(){
      // console.log("响应新增");
      this.operateModel = {
        "_id": "",
        "s_name": "",  //可选，门店名称
        "s_code": "",  //可选，门店编码
        "s_short_code": "",  //可选，门店简码
        "s_addr":"",//门店地址
        "s_province": "",  //必填，省
        "s_city": "",  //必填，市
        "s_district": "",  //必填，区
        "s_city_code": "",  //必填，市级代码
        "createTime": "", 
        "endTime": "", 
        "c_valid": null
      };
      this.$refs.operateStore.dialogVisible = true;
      this.operateTitle='新增门店';
    },
    editStore(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateStore.dialogVisible = true;
      this.operateTitle='编辑门店id:' + item._id;
    },
    deleteStore(item){
      this.$confirm('确定删除该物料?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          storeDelete(params).then(data => {
            this.selectStore();
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
    switchStore(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      storeValid(params).then(data => {
        // this.selectStore();
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
        this.editStore(item); 
      }
      if(type==='delete'){
        this.deleteStore(item);
      }
      if(type==='switch'){
        this.switchStore(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectStore(false);
    },
    // 搜索
    selectStore(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      storeQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      // console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增门店'){
        storeInsert(this.operateModel).then(data => {
          this.selectStore();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateStore.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":[
            "s_code","s_name","s_short_code","s_province","s_city","s_district","s_city_code"
        ]},this.operateModel);
        storeUpdate(params).then(data => {
          this.selectStore();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateStore.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {        
        "_id": "",
        "s_name": "",  //可选，门店名称
        "s_code": "",  //可选，门店编码
        "s_short_code": "",  //可选，门店简码
        "s_addr":"",//门店地址
        "createTime": "", "endTime": "", "c_valid": null
      };
      
    },
    changeModel(data,prop){
      // console.log(data,prop);
      if(prop === 's_city_code'){
        const { s_province,s_city,s_district } = this.regionCodeJson[data]
        this.operateModel.s_province = s_province;
        this.operateModel.s_city = s_city;
        this.operateModel.s_district = s_district;
      }
    }

  }
}
</script><style scoped lang='scss'>

</style>
