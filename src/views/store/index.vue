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
      :handles="handle"
      @handleFun = "handleMethod"
    />
    <pagination
      @pageChangeFun="paginationChange"
      :total="total"
      :page-index="pageIndex"
     />
    <description-dialog 
      ref="printDescription" 
      :descriptModel="descriptModel"
      :descriptions="descripOptions"
      :tableList="deviceList"
      title = "门店设备详情"
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
import descriptionDialog from '@/components/dialog/descriptionTableDialog';
import { printerQuery } from '@/api/print';
import { deviceQuery } from '@/api/device';


export default {
  components:{
    myForm,
    addDialog,
    myTable,
    pagination,
    descriptionDialog
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
        "s_addr":"",//门店地址
        "createTime": "", "endTime": "", "c_valid": null
      },
      selectRule: {
        "#eq":["_id","c_valid"],
        "#like":[
          "s_name","s_code","s_addr"
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
        {type:'s_name_k',label:'门店名称'},
        {type:'s_addr',label:'门店地址'},
        {type:'c_create_time',label:'创建时间'},
        {type:'c_valid',label:'状态',switch:true},
      ],
      handle:[
        {type:'edit',label:'编辑'},
        {type:'delete',label:'删除'},
        {type:'deviceDetail',label:'设备详情'}
      ],
      descriptModel:{},
      descripOptions:[
        {type:'_id',label:'ID',span:2},
        {type:'s_city_code',label:'市级代码'},
        {type:'s_code',label:'门店编码'},
        {type:'s_name',label:'门店名称'},
        {type:'s_addr',label:'门店地址'},
        {type:'c_create_time',label:'创建时间'},
      ],
      deviceList:[

      ],
      deviceData:null,
      printData:null
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
          prop:'s_city_code',
          type:"select",
          label:"门店区域",
          options:this.RegionCodeList,
          props:{"value":'rg_code',"label":'rg_name'},
          rules:[
            { required: true, message: '请选择门店区域获得市级代码', trigger: 'change' },
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
    this.selectStore({refresh:false});

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
          const { rg_province,rg_city,rg_district } = item;
          this.regionCodeJson[item.rg_code] ={
              s_province:rg_province,
              s_city:rg_city,
              s_district:rg_district
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
      if(type==='deviceDetail'){
        this.showDeviceDetail(item);
      }
    },
    selectDevice(s_id){
      this.deviceData = [];
      const dataParams = getPageParams({"#eq":["s_id"]},{ s_id },10,0);
      return new Promise((resolve, reject) => {
        deviceQuery(dataParams).then(data => {
          this.deviceData = getContent(data).map(item=>{
            item.tm_status = item.tm_status==1 ? "在线":"离线";
            item.c_valid = item.c_valid ? "有效":"无效";
            return item;
          });
          resolve();
        })
      })

    },
    selectPrinter(s_id){
      this.printData = [];
      const dataParams = getPageParams({"#eq":["s_id"]},{ s_id },10,0);
      return new Promise((resolve, reject) => {
        printerQuery(dataParams).then(data => {
          // return getContent(data);
          this.printData = getContent(data).map(item=>{
            item.pt_status = item.pt_status==1 ? "在线":"离线";
            item.c_valid = item.c_valid ? "有效":"无效";
            return item;
          });
          resolve();
        })
      });

    },
    async showDeviceDetail(item){
      //根据_id获取设备详情
        this.descriptModel = item;
        this.$refs.printDescription.dialogVisible = true;

        await this.selectPrinter(item._id);
        await this.selectDevice(item._id);        
        this.deviceList=[
          {
            className:"printList",
            title:"打印机一览",
            columnList:[
              {type:'_id',label:'ID'},
              {type:'pt_sn',label:'打印机序列号'},
              {type:'pt_key',label:'打印机密钥'},
              {type:'pt_status',label:'在线状态'},
              {type:'c_valid',label:'状态'},
            ],
            data:this.printData
          },
          {
            className:"deviceList",
            title:"其他设备一览",
            columnList:[
              {type:'_id',label:'ID'},
              {type:'tm_sn',label:'设备编号'},
              {type:'tm_status',label:'在线状态'},
              {type:'c_valid',label:'状态'},
            ],
            data:this.deviceData
          }
        ];
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectStore({refresh:false});
    },
    // 搜索
    selectStore(params={}){
      let { refresh=true,newIndex=this.pageIndex } = params;
      this.pageIndex = newIndex;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,--newIndex,refresh);
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
            "s_code","s_name","s_province","s_city","s_district","s_city_code"
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
        "s_addr":"",//门店地址
        "createTime": "", "endTime": "", "c_valid": null
      };
      
    },
    changeModel(data,prop){
      if(prop === 's_city_code'){
        const { s_province,s_city,s_district } = this.regionCodeJson[data]
        this.operateModel.s_province = s_province;
        this.operateModel.s_city = s_city;
        this.operateModel.s_district = s_district;
      }
      // console.log(data,prop,this.operateModel);

    }

  }
}
</script><style scoped lang='scss'>

</style>
