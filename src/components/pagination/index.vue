<template>
  <div class="pagination-Container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
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
            default:'total, sizes, prev, pager, next, jumper'
        },
        pageSizes:{
            type:Array,
            default:() => [10, 20, 50]
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
        handleSizeChange(val) {
            // this.pageSize = val;
            this.$emit("pageChangeFun","handleSizeChange",val);
        },
        handleCurrentChange(val) {
            // this.pageIndex = val;
            this.$emit("pageChangeFun","handleCurrentChange",val);
        },
    }
}
</script>

<style scoped lang="scss">
    .pagination-Container{
        text-align: center;
    }
</style>