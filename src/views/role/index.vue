<template>
  <div class="app-container">
    <my-form
      ruleForm="selectValid"
      :formData="formData"
      :formModel="formModel"
      @addFun="addValid"
      @selectFun="selectValid"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateValid'
      ruleForm="addValid"
      :title='operateTitle'
      :formData=operateFormData
      :formModel=operateModel
      @submitFun="submitForm"
      @changeModelFun = "changeModel"
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
import { validQuery,validInsert,validUpdate,validValid,validDelete } from '@/api/valid';
import { materialQueryAll } from '@/api/material';
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
      formModel: {"_id": "","m_t_type":null,"m_t_name": "", "createTime": "", "endTime": "", "c_valid": null},
      selectRule: {
        "#eq":["_id","c_valid","m_t_type"],
        "#like":["m_t_name"],
        "#gte":["c_create_time"],
        "#lte":["c_create_time"]
      },
      // 新增
      operateTitle:'新增物料效期',
      operateModel:{
        "m_id" : "",  //必填， 物料ID
        "m_t_name": "",  //必填, 物料名称
        "m_t_type": null,  //必填，物料状态:1-室温 2-冷藏 3-冷冻 4-常温密封 5-其它 6-台面 7-解冻
        "m_t_zl_time": null,  //可选，质量效期 最长
        "m_t_zl_1_time": null,  //可选，质量效期1（黄色预警）短
        "m_t_zl_2_time": null,  //可选，质量效期2（红色预警） 第二长
        "m_t_fw_time": null,  //可选，风味效期 < 质量效期
        "m_t_fw_1_time": null,  //可选，风味效期1（黄色预警）
        "m_t_fw_2_time": null,  //可选，风味效期2（红色预警）
        "m_t_zl_time_unit": 1000*60*24,  //可选，质量效期 单位
        "m_t_zl_1_time_unit": 1000*60*24,  //可选，质量效期1（黄色预警）单位
        "m_t_zl_2_time_unit": 1000*60*24,  //可选，质量效期2（红色预警）单位
        "m_t_fw_time_unit": 1000*60*24,  //可选，风味效期 单位
        "m_t_fw_1_time_unit": 1000*60*24,  //可选，风味效期1（黄色预警）单位
        "m_t_fw_2_time_unit": 1000*60*24,  //可选，风味效期2（红色预警）单位
        "m_t_tag": "",  //可选，标签
      },
      loadOperateModel:{
        "m_id" : "",  //必填， 物料ID
        "m_t_name": "",  //必填, 物料名称
        "m_t_type": null,  //必填，物料状态:1-室温 2-冷藏 3-冷冻 4-常温密封 5-其它 6-台面 7-解冻
        "m_t_zl_time": null,  //可选，质量效期 最长
        "m_t_zl_1_time": null,  //可选，质量效期1（黄色预警）短
        "m_t_zl_2_time": null,  //可选，质量效期2（红色预警） 第二长
        "m_t_fw_time": null,  //可选，风味效期 < 质量效期
        "m_t_fw_1_time": null,  //可选，风味效期1（黄色预警）
        "m_t_fw_2_time": null,  //可选，风味效期2（红色预警）
        "m_t_tag": "",  //可选，标签
      },
      // 表格数据展示
      validList:[],//物料分类列表
      clfObj:null,
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'m_t_name',label:'物料名称'},
        {type:'m_t_tag',label:'物料标签'},
        {type:'m_t_type_desc',label:'物料状态'},
        {type:'m_t_zl_time_desc',label:'质量效期'},
        {type:'m_t_fw_time_desc',label:'赏味效期'},
        {type:'c_create_time',label:'创建时间'},
        {type:'c_valid',label:'状态',switch:true},
      ],
      unitOptions:[
        {label:"天",value:1440000},
        {label:"小时",value:60000},
        {label:"分",value:1000}
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
          prop:'m_t_name',
          type:"input",
          label:"物料名称",
        },
        {
          prop:'m_t_type',
          type:"select",
          label:"物料状态",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ],  
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
      return [
        {
          prop:'m_t_obj',
          type:"selectItem",
          label:"物料名称",
          options:this.validList,
          filterable:true,
          props:{"value":'_id',"label":'clf_name'},
          rules:[
            { required: true, message: '请选择物料名', trigger: 'blur' },
          ]
        },
        {
          prop:'m_t_type',
          type:"select",
          label:"物料状态",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ],  
          rules:[
            { required: true, message: '请选择物料名', trigger: 'blur' },
          ]
        },
        {
          prop:'m_t_zl_time',
          type:"number",
          label:"质量效期",
          unit:this.unitOptions,
          unitProp:'m_t_zl_time_unit',
          rules:[{ type: 'number', message: '请填写数字'}],
        },
        {
          prop:'m_t_fw_time',
          type:"number",
          label:"赏味效期",
          unit:this.unitOptions,
          unitProp:'m_t_fw_time_unit',
          rules:[{ type: 'number', message: '请填写数字'}],
        },
        {
          prop:'m_t_zl_1_time',
          type:"number",
          unit:this.unitOptions,
          unitProp:'m_t_zl_1_time_unit',
          label:"质量效期预警1",
          rules:[{ type: 'number', message: '请填写数字'}]
        },
        {
          prop:'m_t_fw_1_time',
          type:"number",
          unit:this.unitOptions,
          unitProp:'m_t_fw_1_time_unit',
          label:"赏味效期预警1",
          rules:[{ type: 'number', message: '请填写数字'}]
        },
        {
          prop:'m_t_zl_2_time',
          type:"number",
          unit:this.unitOptions,
          unitProp:'m_t_zl_2_time_unit',
          label:"质量效期预警2",
          rules:[{ type: 'number', message: '请填写数字'}]
        },
        {
          prop:'m_t_fw_2_time',
          type:"number",
          unit:this.unitOptions,
          unitProp:'m_t_fw_2_time_unit',
          label:"赏味效期预警2",
          rules:[{ type: 'number', message: '请填写数字'}]
        },
        {
          prop:'m_t_tag',
          type:"number",
          label:"物料标签",  
          rules:[
            { required: true, message: '请填写', trigger: 'blur' },
          ]
        }
      ]
    },

  },
  mounted(){
    this.getValidList();
  },
  methods: {
    // 搜索
    selectValid(refresh){
      // console.log(this.clfObj);
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex,refresh);
      // console.log(this.formModel,dataParams);
      validQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
    },
    // 获取归属分类
    getValidList(){
      materialQueryAll().then(data => {
        // this.validList = getContent(data);
        this.validList = getContent(data).map(item => {
          return {value:item._id,label:item.m_name};
        });
        // resolve();
      }).then(() => {
        this.selectValid(false);
      })
    },
    // 新增
    addValid(){
      // console.log("响应新增");
      this.operateModel = {
        "m_id" : "",  //必填， 物料ID
        "m_t_name": "",  //必填, 物料名称
        "m_t_type": null,  //必填，物料状态:1-室温 2-冷藏 3-冷冻 4-常温密封 5-其它 6-台面 7-解冻
        "m_t_zl_time": null,  //可选，质量效期 最长
        "m_t_zl_1_time": null,  //可选，质量效期1（黄色预警）短
        "m_t_zl_2_time": null,  //可选，质量效期2（红色预警） 第二长
        "m_t_fw_time": null,  //可选，风味效期 < 质量效期
        "m_t_fw_1_time": null,  //可选，风味效期1（黄色预警）
        "m_t_fw_2_time": null,  //可选，风味效期2（红色预警）
        "m_t_zl_time_unit": 1440000,  //可选，质量效期 单位
        "m_t_zl_1_time_unit": 1000*60*24,  //可选，质量效期1（黄色预警）单位
        "m_t_zl_2_time_unit": 1000*60*24,  //可选，质量效期2（红色预警）单位
        "m_t_fw_time_unit": 1000*60*24,  //可选，风味效期 单位
        "m_t_fw_1_time_unit": 1000*60*24,  //可选，风味效期1（黄色预警）单位
        "m_t_fw_2_time_unit": 1000*60*24,  //可选，风味效期2（红色预警）单位
        "m_t_tag": "",  //可选，标签
      };
      this.$refs.operateValid.dialogVisible = true;
      this.operateTitle='新增物料';
    },
    editValid(item){
      // console.log("响应编辑");
      this.operateModel = item;
      // console.log(item);
      this.$refs.operateValid.dialogVisible = true;
      this.operateTitle=`编辑物料id: ${item._id}`;
    },
    deleteValid(item){
      this.$confirm('确定删除该物料?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = getDataParams({"#eq":["_id"]},item);
          validDelete(params).then(data => {
            this.selectValid();
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
    switchValid(item){
      const operateModel = {"_id":item._id,c_valid:item.c_valid};
      const params = getDataParams({"#eq":["_id"],"#set":["c_valid"]},operateModel);
      // console.log(item,params);
      validValid(params).then(data => {
        // this.selectValid();
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
        this.editValid(item); 
      }
      if(type==='delete'){
        this.deleteValid(item);
      }
      if(type==='switch'){
        this.switchValid(item);
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectValid(false);
    },
    // 提交 
    submitForm(){

      // console.log(this.operateModel);
      let loadOperateModel = {};
      for(let index in this.loadOperateModel){
        if(this.operateModel[index]==null || this.operateModel[index]=='') return;
        if(index.match(/_time$/ig)) loadOperateModel[index] = this.operateModel[index] * this.operateModel[index+"_unit"];
        else loadOperateModel[index] = this.operateModel[index];
      }
      // console.log(loadOperateModel);

      if(this.operateTitle === '新增物料'){
        validInsert(loadOperateModel).then(data => {
          this.selectValid();
          this.$message({
            type: 'success',
            message: '保存成功！!'
          });
          this.$refs.operateValid.dialogVisible = false;
        })
      }else{
        // 编辑
        const params = getDataParams({"#eq":["_id"],"#set":["m_t_name","m_t_type"]},this.operateModel);
        validUpdate(params).then(data => {
          this.selectValid();
          this.$message({
            type: 'success',
            message: '修改成功！!'
          });
          this.$refs.operateValid.dialogVisible = false;
        })
      }
    },
    changeModel(data,prop){
        // console.log(data,prop);
        if(prop === 'm_t_obj') 
          this.operateModel.m_t_name = data.label;
          this.operateModel.m_id = data.value;
        // console.log(this.operateModel);
    },
    // 清空
    cancelMethod(){
      this.formModel = {"_id": "","m_t_type":null,"m_t_name": "", "createTime": "", "endTime": "", "c_valid": null};
      
    }
  }
}
</script>
<style scoped lang='scss'>

</style>
