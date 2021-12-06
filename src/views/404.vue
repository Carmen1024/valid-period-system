<template>
  <div class="http404-container">
      <img class="http404_bg" src="@/assets/background/bg.png" alt="bg">
      <div class="http404_content">
        <div class="http404_msg">
          <span>4</span>
          <img class="pic0" src="@/assets/images/0.png">
          <span>4</span>
        </div>
        <div class="http404_tip">哦哦！网页找不到了...</div>
        <div class="http404_tipDetail">
          重新打开<router-link to="/">首页</router-link>试试
        </div>
        <div class="http404_tipDetail">
          或者点杯奶茶休息一下~
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
  .http404-container{
    width: 100%;
    height: 100%;
    position: relative;
    
    .http404_bg{
      width: 100%;
    }
    .http404_content{
      position:absolute;
      top: 40%;
      left: 50%;
      margin: auto;
      width: 500px;
      // height: 200px;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #666;
      font-size: 18px;
      font-weight: bold;

      .http404_msg{
        display: flex;
        margin: auto;
        width: 260px;
        height: 200px;
        line-height: 200px;
        justify-content:space-evenly;

        img{
          height: 200px;

        }
        span{
          // display: inline-block;
          margin: 0 10px;
          color: #1a2a78;
          font-size: 200px;

        }
      }
      .http404_tip{
        margin-top: 20px;
        font-size: 26px;
      }
      .http404_tipDetail{
        margin-top: 20px;
      }
    }
  }
  

</style>
