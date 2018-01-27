<template>
  <div id="app">
    <cb-navbar></cb-navbar>
    <div id="content">
      <div class="columns">
        <div class="column is-3">
          <cb-sidebar></cb-sidebar>
        </div>
        <div class="column is-9">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './Navbar';
  import Sidebar from './Sidebar';

  export default {
    name: 'cb-app',
    components: {
      'cb-navbar': Navbar,
      'cb-sidebar': Sidebar
    }
  };
</script>

<style lang="scss">
  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  #content {
    padding: 0 24px;
  }
</style>
