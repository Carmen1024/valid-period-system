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
      formData: [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'s_city_code',
          type:"select",
          label:"市级代码"
        },
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
      ],
      // 新增
      operateTitle:'新增门店',
      operateModel:{},
      // 编辑:
      // 表格数据展示
      areaList:[],//物料分类列表
      areaJson:{},
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
        },{
        prop:'s_city_code',
        type:"select",
        label:"省市区",
        options:this.areaList,
        // filterable:true,
        // props:{"value":'_id',"label":'area_name'},
        rules:[
          { required: true, message: '请选择省市区', trigger: 'blur' },
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
    this.getAreaList();
  },
  methods: {
    // 获取归属分类
    getAreaList(){
      classifyQueryAll().then(data => {
        // this.areaList = getContent(data);
        this.areaList = getContent(data).map(item => {
          this.areaJson[item._id] = item.area_name;
          return {value:item._id,label:item.area_name};
        });
        // resolve();
      }).then(()=>{
        this.selectStore(false);
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
        "s_province": "四川省",  //必填，省
        "s_city": "成都市",  //必填，市
        "s_district": "高新区",  //必填，区
        "s_city_code": "101",  //必填，市级代码
        "createTime": "", "endTime": "", "c_valid": null
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
      this.formModel = {"_id": "","area_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script><style scoped lang='scss'>

</style>
