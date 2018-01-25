<template>
  <nav>
    <img src="~@/assets/logo.png" alt="Code book logo">
  </nav>
</template>

<script>
  export default {
    name: 'cb-navbar',
    data() {
      return {}
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      }
    }
  };
</script>

<style lang="scss" scoped>
  nav {
    -webkit-app-region: drag;
    background-color: $primary;
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;

    img {
      padding: 10px 10px 4px 10px;
      width: 110px;
    }
  }
</style>
