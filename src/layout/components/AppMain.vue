<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang='scss'>
  .app-main {
    /*50 = navbar  */
    /* min-height: calc(100vh - 50px); */
    height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;

    // &::-webkit-scrollbar {
    //   display: none;
    // }

    &::-webkit-scrollbar {
      width: 5px;
      height: 8px;
      background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background:  rgba(#152a7d,.9);
        border-radius: 5px;
    }

  }
  .fixed-header+.app-main {
    padding-top: 50px;
  }

  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
