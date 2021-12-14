<template>
  <div class="app-container">
    <my-form
      ruleForm="selectSupervise"
      :formData="formData"
      :formModel="formModel"
      @addFun="addSupervise"
      @selectFun="selectSupervise"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateSupervise'
      ruleForm="addSupervise"
      width="60%"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      :transferKey="storeName"
      @submitFun="submitForm"
      @resetTransfer="getStoreList"
      @resetTransferByKey="getStoreListByName"
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
import { superviseQuery,superviseInsert,superviseUpdate,superviseValid,superviseDelete } from '@/api/supervise';
import { getPageParams,getContent, getDataParams, getPageTotal } from '@/utils/dataParams';
import { getRegion } from '@/utils/region';
import { storeQuery } from '@/api/store';
import { validatePhone } from '@/utils/validate';

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
      formModel: {"_id": "","super_name": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid"],
        "#like":["super_name"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },
      // 新增
      operateTitle:'新增督导',
      operateModel:{
        "super_code": "", 
        "super_name": "",
        "super_storeList": [],  
        "super_regionList":[]
      },
      provinceList:[],
      // 编辑:
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      list: null,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'super_province',label:'姓名'},
        {type:'super_city',label:'电话'},
        {type:'super_district',label:'所属区域'},
        {type:'super_code',label:'关联门店'},
        {type:'c_create_time',label:'创建时间'},
        {type:'c_valid',label:'状态',switch:true},
      ],
      // 搜索门店
      storeList:[],
      storeName:"",
      storeIndex:1,
      storeSize:10,
      storeTotal:0
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
          prop:'super_name',
          type:"input",
          label:"姓名",
        },
        {
          prop:'super_phone',
          type:"input",
          label:"电话",
        },
        {
          prop:'super_regionList',
          type:"cascader",
          label:"省市区",
          style:'width:100%',
          rules:[
            { required: true, message: '请选择省市区', trigger: 'change' },
          ],
          options:this.provinceList,
          // filterable:true,
          props:{"value":'name',"label":'name'},
        },
        {
          prop:'c_valid',
          type:"select",
          options:[{label:'启用',value:true},{label:'禁用',value:false}],
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
      ];
    },
    operateFormData:function(){
      return [
        {
          prop:'super_name',
          type:"input",
          label:"姓名",
          rules:[
            { required: true, message: '请输入姓名', trigger: 'change' },
          ],
        },
        {
          prop:'super_phone',
          type:"input",
          label:"电话",
          rules:[
            { required: true, message: '请输入电话', trigger: 'blur' },
            { required: true,max: 11, message: '请输入正确的11位手机号',validator:validatePhone, trigger: 'blur' }
          ],
        },{
          prop:'super_regionList',
          type:"cascader",
          label:"省市区",
          style:'width:100%',
          rules:[
            { required: true, message: '请选择省市区', trigger: 'change' },
          ],
          options:this.provinceList,
          // filterable:true,
          props:{"value":'name',"label":'name'},
        },{
          prop:'super_storeList',
          type:"transferandpage",
          label:"关联门店",
          style:'width:100%',
          options:this.storeList,
          total:this.storeTotal,
          placeholder:'请输入关键字搜索门店，例如：成都',
          style:"width:100%;height:300px",
        }]
      }
  },
  mounted() {
    this.selectSupervise(false);
    this.getRegionList();
    this.getStoreList();
  },
  methods: {
    // 搜索省市区代码
    getRegionList(){
      getRegion("").then(data=>{
        // console.log(data);
        this.provinceList = data;
      });
    },
    getStoreListByName(val){
      this.storeName = val;
      this.getStoreList();
    },
    getStoreList(storeIndex=this.storeIndex){
      // 搜索
      const selectRule = {"#like":["s_name"]};
      const formModel = {"s_name":this.storeName};
      const dataParams = getPageParams(selectRule,formModel,this.storeSize,--storeIndex,true);
      storeQuery(dataParams).then(data => {
        this.storeList = getContent(data).map(item=>{
          return {key:item._id,label:item.s_name};
        });
        this.storeTotal = getPageTotal(data);
      })
    },
    // 新增
    addSupervise(){
      // console.log("响应新增");
      console.log(this.storeList.map(item=>item.key));
      this.operateModel = {
        "super_code": "", 
        "super_name": "",
        "super_storeList": [],  
        "super_regionList":[]
      };
      this.$refs.operateSupervise.dialogVisible = true;
      this.operateTitle='新增督导';
    },
    editSupervise(item){
      // console.log("响应编辑");
      item.super_regionList = [item.super_province,item.super_city,item.super_district];
      this.operateModel = item;
      
      // console.log(item);
      this.$refs.operateSupervise.dialogVisible = true;
      this.operateTitle='编辑督导id:' + item._id;
    },
    deleteSupervise(item){
      this.$confirm('确定删除该督导?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          superviseDelete(params).then(data => {
            this.selectSupervise();
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
    switchSupervise(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      superviseValid(params).then(data => {
        // this.selectSupervise();
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
        this.editSupervise(item); 
      }
      if(type==='delete'){
        this.deleteSupervise(item);
      }
      if(type==='switch'){
        this.switchSupervise(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectSupervise(false);
    },
    // 搜索
    selectSupervise(refresh){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      superviseQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      // console.log("响应搜索，发送请求ing");
    },
    // 提交
    submitForm(){

      let operateModel = this.operateModel
      // 重新组装
      if(this.operateModel.super_regionList.length >= 3){
        let [ super_province,super_city,super_district ] = operateModel.super_regionList;
        const super_name = operateModel.super_regionList.join("");
        operateModel = {...operateModel,super_province,super_city,super_district,super_name};
      }

      // console.log(this.operateModel);
      if(this.operateTitle === '新增督导'){
        superviseInsert(operateModel).then(data => {
          this.selectSupervise();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateSupervise.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["super_code","super_name","super_province","super_city","super_district"],},operateModel);
        superviseUpdate(params).then(data => {
          this.selectSupervise();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateSupervise.dialogVisible = false;
        })
      }

    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","super_code": "","super_name": "", "createTime": "", "endTime": "", "c_valid": null};
    }

  }
}
</script><style scoped lang='scss'>

</style>
