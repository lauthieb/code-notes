<template>
  <div id="app">
    <cn-navbar></cn-navbar>
    <div id="content">
      <div class="columns">
        <div class="column is-3 side-colum">
          <cn-sidebar></cn-sidebar>
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
  name: 'cn-app',
  components: {
    'cn-navbar': Navbar,
    'cn-sidebar': Sidebar,
  },
};
</script>

<style lang="scss">
html.dark {
  background-color: $black!important;
}
body {
  font-family: 'Source Sans Pro', sans-serif;
}

.side-colum {
  min-height: 56vh;
  html.dark & {
    background-color: $dark;
  }
}

#content {
  padding: 0 24px;
}
</style>
