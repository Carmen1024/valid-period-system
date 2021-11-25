<template>
  <div class="app-container">
    <my-form
      ruleForm="test"
      :formData=formData
      @addFun="addSort"
      @selectFun='selectSort'
     /> 
  </div>
</template>

<script>
import myForm from '@/components/myForm';

export default {
  components:{
    myForm
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      formData:[
        {
          prop:'name',
          model:"测试数据",
          type:"input",
          label:"名称",
          rules:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        {
          prop:'name2',
          model:"测试数据2",
          type:"input",
          label:"名称"
        }
      ]
    }
  },
  created() {

  },
  methods: {
    addSort(){
      console.log("响应新增！");
    },
    selectSort(selectModel){
      console.log(JSON.parse(selectModel));
      console.log("响应搜索！");
    }
  }
}
</script>
<style scoped lang='scss'>

</style>
