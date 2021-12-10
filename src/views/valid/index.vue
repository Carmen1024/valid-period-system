<template>
  <div class="app-container">
    <my-form
      ruleForm="selectValid"
      :formData="formData"
      :formModel="formModel"
      @addFun="addValid"
      @selectFun="selectMethod"
      @cancelFun="cancelMethod"
     />
     <add-dialog 
      ref='operateValid'
      ruleForm="addValid"
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
      :page-index="pageIndex"
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
        "m_t_name": "",  //必填, 归属物料
        "m_t_type": null,  //必填，物料状态:1-室温 2-冷藏 3-冷冻 4-常温密封 5-其它 6-台面 7-解冻
        "m_t_zl_time": null,  //可选，质量效期 最长
        "m_t_zl_1_time": null,  //可选，质量效期1（黄色预警）短
        "m_t_zl_2_time": null,  //可选，质量效期2（红色预警） 第二长
        "m_t_fw_time": null,  //可选，风味效期 < 质量效期
        "m_t_fw_1_time": null,  //可选，风味效期1（黄色预警）
        "m_t_fw_2_time": null,  //可选，风味效期2（红色预警）
        "m_t_tag": "",  //可选，标签
      },
      loadOperateModel:{
        "m_id" : "",  //必填， 物料ID
        "m_t_name": "",  //必填, 归属物料
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
      materialList:[],//物料分类列表
      materialJson:{},
      clfObj:null,
      pageSize:10,
      pageIndex:1,
      total:10,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'m_t_name',label:'归属物料'},
        {type:'m_t_tag',label:'物料标签'},
        
        {type:'m_t_type_desc',label:'物料状态'},
        {type:'m_t_zl_time_desc',label:'质量效期'},
        {type:'m_t_fw_time_desc',label:'赏味效期'},
        {type:'c_create_time',label:'创建时间'},
        {type:'c_valid',label:'状态',switch:true},
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
          label:"归属物料",
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
          prop:'m_id',
          type:"select",
          label:"归属物料",
          options:this.materialList,
          rules:[
            { required: true, message: '请选择归属物料', trigger: 'blur' },
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
          type:"timeUtil",
          label:"质量效期",
        },
        {
          prop:'m_t_fw_time',
          type:"timeUtil",
          label:"赏味效期",
        },
        {
          prop:'m_t_zl_1_time',
          type:"timeUtil",
          label:"质量效期预警1",
        },
        {
          prop:'m_t_fw_1_time',
          type:"timeUtil",
          label:"赏味效期预警1",
        },
        {
          prop:'m_t_zl_2_time',
          type:"timeUtil",
          label:"质量效期预警2",
        },
        {
          prop:'m_t_fw_2_time',
          type:"timeUtil",
          label:"赏味效期预警2",
        },
        {
          prop:'m_t_tag',
          type:"input",
          label:"物料标签",  
          rules:[
            { required: true, message: '请填写', trigger: 'blur' },
          ]
        }
      ]
    },

  },
  mounted() {
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
    async getValidList(){
      await materialQueryAll().then(data => {
        // this.materialList = getContent(data);
        this.materialList = getContent(data).map(item => {
          this.materialJson[item._id] = item.m_name;
          return {value:item._id,label:item.m_name};
        });
        // resolve();
        console.log(this.materialList);
      });
      this.selectValid();
    },
    // 新增
    addValid(){
      // console.log("响应新增");
      this.operateModel = {
        "m_id" : "",  //必填， 物料ID
        "m_t_name": "",  //必填, 归属物料
        "m_t_type": null,  //必填，物料状态:1-室温 2-冷藏 3-冷冻 4-常温密封 5-其它 6-台面 7-解冻
        "m_t_zl_time": null,  //可选，质量效期 最长
        "m_t_zl_1_time": null,  //可选，质量效期1（黄色预警）短
        "m_t_zl_2_time": null,  //可选，质量效期2（红色预警） 第二长
        "m_t_fw_time": null,  //可选，风味效期 < 质量效期
        "m_t_fw_1_time": null,  //可选，风味效期1（黄色预警）
        "m_t_fw_2_time": null,  //可选，风味效期2（红色预警）
        "m_t_tag": "",  //可选，标签
      };
      this.$refs.operateValid.dialogVisible = true;
      this.operateTitle='新增物料效期';
    },
    editValid(item){
      this.operateModel = item;
      // console.log("响应编辑",this.operateModel);
      this.$refs.operateValid.dialogVisible = true;
      this.operateTitle=`编辑物料效期id: ${item._id}`;
    },
    deleteValid(item){
      this.$confirm('确定删除该物料效期?','提示', {
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
      let loadOperateModel = this.operateModel;
      loadOperateModel.m_t_name = this.materialJson[loadOperateModel.m_id];

      if(this.operateTitle === '新增物料效期'){
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
        const params = getDataParams({
          "#eq":["_id"],
          "#set":[
            "m_id",
            "m_t_name",
            "m_t_type",
            "m_t_tag",
            "m_t_zl_time",
            "m_t_zl_1_time",
            "m_t_zl_2_time",
            "m_t_fw_time",
            "m_t_fw_1_time",
            "m_t_fw_2_time",
          ],
        },this.operateModel);
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
    selectMethod(){
      //返回到第一页
      this.pageIndex = 1;
      this.selectValid();
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
