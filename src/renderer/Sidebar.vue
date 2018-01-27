<template>
  <aside class="menu">
    <p class="menu-label">
      Languages
    </p>
    <ul class="menu-list">
      <li>
        <a class="is-active">All <b-tag class="is-pulled-right" type="is-dark">{{snippets.length}}</b-tag></a>
      </li>
      <li v-for="(list, value) in Array.from(languages)">
        <a>{{list[0] | capitalize}} <b-tag class="is-pulled-right" type="is-dark">{{list[1]}}</b-tag></a>
      </li>
    </ul>
  </aside>
</template>

<script>
  import Vuex from 'vuex';

  export default {
    name: 'cb-sidebar',
    data() {
      return {}
    },
    computed: {
      ...Vuex.mapGetters(['languages', 'snippets']),
    }
  };
</script>

<style lang="scss" scoped>
  aside {
    position: fixed;
    top: 50px;
    width: 22%;
    margin-top: 18px;

    li {
      margin: 5px 0;
    }
  }
</style>
