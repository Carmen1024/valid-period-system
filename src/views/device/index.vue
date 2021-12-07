<template>
  <div class="app-container">
    <my-form
      ruleForm="selectDevice"
      :formData="formData"
      :formModel="formModel"
      @addFun="addDevice"
      @selectFun="selectDevice"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateDevice'
      ruleForm="addDevice"
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
import { deviceQuery,deviceInsert,deviceUpdate,deviceValid,deviceDelete } from '@/api/device';
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
        {type:'s_id_desc',label:'所属门店'},
        {type:'tm_status',label:'在线状态'},
        {type:'tm_key',label:'设备KEY'},
        {type:'c_create_time',label:'创建时间'},
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
          type:"select",
          label:"所属门店",
          options:this.storeList,
          filterable:true,
          props:{"value":'_id',"label":'store_name'}
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
        type:"select",
        label:"所属门店",
        options:this.storeList,
        filterable:true,
        props:{"value":'_id',"label":'store_name'},
        rules:[
          { required: true, message: '请选择门店', trigger: 'blur' },
        ]
      },
      {
        prop:'tm_status',
        type:"select",
        options:[{label:'在线',value:1},{label:'离线',value:0}],
        label:"设备状态",
      },{
        prop:'tm_key',
        type:"input",
        label:"设备Key"
      },
      ]
    },

  },
  created() {
    this.getStoreList();
  },
  methods: {
    // 搜索
    selectDevice(refresh){
      console.log(refresh);
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      deviceQuery(dataParams).then(data => {
        this.list = getContent(data).map(item => {
          item.store_name = this.storeJson[item.store_id];
          return item;
        });
        this.total = getPageTotal(data);
      })
    },
    // 获取归属门店
    getStoreList(){
      classifyQueryAll().then(data => {
        // this.storeList = getContent(data);
        this.storeList = getContent(data).map(item => {
          this.storeJson[item._id] = item.store_name;
          return {value:item._id,label:item.store_name};
        });
        // resolve();
      }).then(()=>{
        this.selectDevice(false);
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
      // console.log(item);
      this.$refs.operateDevice.dialogVisible = true;
      this.operateTitle=`编辑设备id: ${item._id},设备编号：${item.m_code}`;
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
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      deviceValid(params).then(data => {
        // this.selectDevice();
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
        this.editDevice(item); 
      }
      if(type==='delete'){
        this.deleteDevice(item);
      }
      if(type==='switch'){
        this.switchDevice(item);
      }
    },
    paginationChange(type,val){
      // console.log(type,val);
      if(type === 'handleSizeChange') 
        this.pageSize = val;
      else 
        this.pageIndex = val;

      this.selectDevice(false);
    },
    // 提交
    submitForm(){

      // console.log(this.operateModel);
      if(this.operateTitle === '新增设备'){
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
        const params = getDataParams({"#eq":["_id"],"#set":["m_name","store_id"]},this.operateModel);
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
      this.formModel = {"_id": "","store_id":null,"m_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }

  }
}
</script>
<style scoped lang='scss'>

</style>
