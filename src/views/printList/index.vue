<template>
  <div class="app-container">
    <my-form
      ruleForm="selectPrintHistory"
      :formData="formData"
      :formModel="formModel"
      :handles="formHandle"
      @selectFun="selectPrintHistory"
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

     />
     <description-dialog 
      ref="printDescription" 
      :descriptModel="descriptModel"
      :descriptions="descripOptions"
      title = "打印内容详情"
    />
  </div>
</template>

<script>
import myForm from '@/components/myForm';
import myTable from '@/components/myTable';
import pagination from '@/components/pagination';
import descriptionDialog from '@/components/dialog/descriptionDialog';
import { printHistoryQuery } from '@/api/print';
import { getPageParams,getContent, getPageTotal } from '@/utils/dataParams';

export default {
  components:{
    myForm,
    myTable,
    pagination,
    descriptionDialog
  },
  data() {
    return {
      formHandle:[{buttonStyle:"primary",label:"搜索",type:"select"}],
      handle:[{label:"详情",type:"detail"}],
      list: null,
      listLoading: true,
      // 搜索展示
      formModel: {"_id": "","m_t_type":'',"clf_name": "","m_name": "","s_name": "","m_t_name": "","pt_h_sn": "", "createTime": "", "endTime": ""},
      selectRule: {
        "#eq":["_id","m_t_type"],
        "#like":["clf_name","m_name","s_name","m_t_name","pt_h_sn"],
        "#gte":["pt_h_time"],
        "#lte":["pt_h_time"]
      },
      formData: [
        {
          prop:'_id',
          type:"input",
          label:"ID"
        },
        {
          prop:'clf_name',
          type:"input",
          label:"分类名称"
        },
        {
          prop:'m_name',
          type:"input",
          label:"物料名称"
        },
        {
          prop:'s_name',
          type:"input",
          label:"门店名称"
        },
        {
          prop:'m_t_type',
          type:"select",
          options:[
            {label:'室温',value:1},{label:'冷藏',value:2},{label:'冷冻',value:3},{label:'常温密封',value:4},
            {label:'其它',value:5},{label:'台面',value:6},{label:'解冻',value:7},
          ], 
          label:"物料状态",
        },
        {
          prop:'m_t_name',
          type:"input",
          label:"物料标签"
        },
        {
          prop:'pt_h_sn',
          type:"input",
          label:"打印列号"
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
      // 表格数据展示
      pageSize:10,
      pageIndex:1,
      total:10,
      list: null,
      columnList:[
        {type:'_id',label:'ID'},
        {type:'pt_h_sn',label:'打印序列号'},
        {type:'s_name',label:'门店名称'},
        {type:'m_name',label:'物料名称'},
        {type:'clf_name',label:'分类名称'},
        {type:'m_t_type_desc',label:'物料状态'},
         {type:'m_t_name',label:'物料标签'},
        {type:'pt_h_time',label:'打印时间'}
      ],
      descriptModel:null,
      descripOptions:[
        {type:'_id',label:'ID',span:2},
        {type:'s_name',label:'门店名称'},
        {type:'m_name',label:'物料名称'},
        {type:'clf_name',label:'分类名称'},
        {type:'m_t_type_desc',label:'物料状态'},
        {type:'m_t_name',label:'物料标签'},
        {type:'pt_h_sn',label:'打印序列号'},
        {type:'pt_h_time',label:'打印时间'}
      ]
    }
  },
  created() {
    this.selectPrintHistory();
  },
  methods: {
    // 表格操作：详情
    handleMethod(type,item){
      item = JSON.parse(JSON.stringify(item));
      // console.log(type,item);
      if(type === 'detail'){
        this.descriptModel = item;
        console.log(this.descriptModel,this.descripOptions);
        this.$refs.printDescription.dialogVisible = true;
        // this.editPrintHistory(item); 
      }
    },
    paginationChange(type,val){
      if(type === 'handleSizeChange') this.pageSize = val;
      else this.pageIndex = val;
      this.selectPrintHistory();
    },
    // 搜索
    selectPrintHistory(){
      const pageIndex = this.pageIndex - 1;
      const dataParams = getPageParams(this.selectRule,this.formModel,this.pageSize,pageIndex);
      printHistoryQuery(dataParams).then(data => {
        this.list = getContent(data);
        this.total = getPageTotal(data);
      })
      console.log("响应搜索，发送请求ing");
    },

  }
}
</script><style scoped lang='scss'>

</style>
