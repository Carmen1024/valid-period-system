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
        pageSize:{
            type:Number,
            default:10
        },
        pageSizes:{
            type:Array,
            default:() => [10, 20, 50]
        },
        pageIndex:{
            type:Number,
            default:1
        }
        
    },
    watch:{
        total:{
            handler: function (val, oldVal) {

            },
            deep:true
        },
        pageIndex:{
            handler: function (val, oldVal) {

            },
            deep:true
        }
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
        margin-top: 10px;
    }
</style>