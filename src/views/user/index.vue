<template>
  <h1>{{ userName }}</h1>
</template>

<script>
export default {
  data() {
    return {
      userName: 'user'
    }
  },
  created() {
    this.userName = '???'
  }
}
</script>
