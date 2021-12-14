<template>
  <div class="globalSetting-container">
    <div>
      <span>是否关闭所有设备音量：</span>
      <el-radio v-model="radio" :label="1">打开</el-radio>
      <el-radio v-model="radio" :label="0">关闭</el-radio>
    </div>
    <div>
      <span>一级预警颜色：</span><el-color-picker v-model="color1"></el-color-picker>
    </div>
    <div>
      <span>二级预警颜色：</span><el-color-picker v-model="color2"></el-color-picker>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio:1,
      color1:"#FFF000",
      color2:"#FF0000",
    }
  },
  created() {
    this.userName = '???'
  }
}
</script>
<style scoped lang="scss">
  .globalSetting-container{
    padding: 20px;
    div{
      margin:10px 0;
      line-height: 50px;
      vertical-align: middle;
    }
  }
</style>
