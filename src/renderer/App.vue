<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'code-notes',
};
</script>

<style lang="scss">

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #wrapper {
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

</style>
