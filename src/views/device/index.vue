<template>
  <div class="app-container">
    <my-form
      ruleForm="selectDevice"
      :formData="formData"
      :formModel="formModel"
      @addFun="addDevice"
      @selectFun="selectDevice"
      @cancelFun="cancelMethod"
      @remoteFun="getStoreList"
     />
     <add-dialog 
      ref='operateDevice'
      ruleForm="addDevice"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      @submitFun="submitForm"
      @remoteFun="getStoreList"
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
import { deviceQuery,deviceInsert,deviceUpdate,deviceValid,deviceDelete } from '@/api/device';
import { storeQueryValid } from '@/api/store';
import { getPageParams,getContent, getDataParams, getPageTotal, isEmpty } from '@/utils/dataParams';

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
      formModel: {"_id": "","s_id":null,"c_valid": "", "tm_status": null,"tm_sn": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","s_id","tm_status"],
        "#like":["tm_sn"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },

      // 新增
      operateTitle:'新增设备',
      operateModel:{},
      // 表格数据展示
      storeList:[],//设备门店列表
      storeJson:{},
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'tm_sn',label:'设备编号'},
        {type:'s_name',label:'所属门店'},
        // {type:'tm_key',label:'设备KEY'},
        {type:'c_create_time',label:'创建时间'},
        {type:'tm_status',label:'在线状态',switchStatus:true,activeText:"在线",inactiveText:"离线"},
        {type:'c_valid',label:'状态',switch:true},
      ],
    }
  },
  computed:{
    formData: function() {
      return [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'tm_sn',
          type:"input",
          label:"设备编号"
        },
        {
          prop:'s_id',
          type:"selectRemote",
          label:"所属门店",
          options:this.storeList,
          filterable:true,
        },
        {
          prop:'tm_status',
          type:"select",
          options:[{label:'在线',value:1},{label:'离线',value:0}],
          label:"设备状态",
        },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'有效',value:true},{label:'无效',value:false}],
          label:"在线状态",
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
      return [
      {
        prop:'tm_sn',
        type:"input",
        label:"设备编号",
        rules:[
          { required: true, message: '请输入设备编号', trigger: 'blur' },
        ]
      },{
          prop:'s_id',
          type:"selectRemote",
          label:"所属门店",
          options:this.storeList,
          filterable:true,
      },
      {
        prop:'tm_status',
        type:"select",
        options:[{label:'在线',value:1},{label:'离线',value:0}],
        label:"设备状态",
      },
      // {
      //   prop:'tm_key',
      //   type:"input",
      //   label:"设备Key"
      // },
      ]
    },

  },
  created() {
    // this.getStoreList();
    this.selectDevice({refresh:false});
  },
  methods: {
    // 搜索
    selectDevice(params={}){
      let { refresh=true,newIndex=this.pageIndex } = params;
      this.pageIndex = newIndex;

      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,--newIndex,refresh);
      
      deviceQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.store_name = this.storeJson[item.s_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 获取归属门店
    getStoreList(name){
      if(isEmpty(name)) return;
      const params = getDataParams({"#like":["s_name"]},{s_name:name});
      storeQueryValid(params).then(data => {
        this.storeList = getContent(data).map(item => {
          this.storeJson[item._id] = item.s_name;
          return {value:item._id,label:item.s_name};
        });
        // resolve();
      })
    },
    // 新增
    addDevice(){
      this.operateModel = {tm_sn:'',s_id:'',tm_status:1,tm_key:""};
      this.$refs.operateDevice.dialogVisible = true;
      this.operateTitle='新增设备';
    },
    editDevice(item){
      // console.log("响应编辑");
      this.operateModel = item;
      this.getStoreList(item.s_name);
      // console.log(item);
      this.$refs.operateDevice.dialogVisible = true;
      this.operateTitle=`编辑设备: ${item._id}`;
    },
    deleteDevice(item){
      this.$confirm('确定删除该设备?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          deviceDelete(params).then(data => {
            this.selectDevice();
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
    switchDevice(item){
      let { _id,c_valid,tm_status } = item;
      const operateModel = { _id,c_valid,tm_status };
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      deviceValid(params).then(data => {
        this.selectDevice();
        this.$message({
          type: 'success',
          message: '状态切换成功！!'
        });
      })
    },
    // 表格操作：编辑 删除
    handleMethod(type,item,prop){
      item = JSON.parse(JSON.stringify(item));
      // console.log(type,item);
      if(type==='edit'){
        this.editDevice(item); 
      }
      if(type==='delete'){
        this.deleteDevice(item);
      }
      if(type==='switch'){
        if(prop=='c_valid') this.switchDevice(item);
        else{
          this.operateModel = item;
          // console.log(item);
          this.submitForm("update")
        };
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectDevice({refresh:false});
    },
    // 提交
    submitForm(type="add"){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增设备' && type=="add"){
        deviceInsert(this.operateModel).then(data => {
          this.selectDevice();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateDevice.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({
          "#eq":["_id"],
          "#set":["tm_status","s_id","tm_status","tm_sn"]
          },this.operateModel);
        deviceUpdate(params).then(data => {
          this.selectDevice();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateDevice.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","s_id":null,"tm_key": "",tm_status:null,tm_sn:"", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
