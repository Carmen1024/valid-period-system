<template>
  <div class="pagination-Container">
    <el-pagination
      small
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :layout="layout"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {

    data() {
        return {
            pageSize:10,
            pageIndex:1,
        }
    },
    props:{
        total:{
            type:Number,
            default:10
        },
        layout:{
            type:String,
            default:'total, prev, pager, next'
        }
        
    },
    watch:{
        total:{
            handler: function (val, oldVal) {

            },
            deep:true
        },
    },
    methods:{
        handleCurrentChange(val) {
            // this.pageIndex = val;
            this.$emit("pageChangeFun",val);
        },
    }
}
</script>

<style scoped lang="scss">
    .pagination-Container{
        text-align: center;
        margin-top: 10px;
    }
</style>