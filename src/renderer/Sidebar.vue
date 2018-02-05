<template>
  <aside class="menu">
    <p class="menu-label">
      Languages
    </p>
    <ul class="menu-list">
      <li>
        <a :class="{'is-active': languageSelected === 'all'}" @click="selectLanguage('all')">All <b-tag class="is-pulled-right" type="is-dark">{{totalFiles}}</b-tag></a>
      </li>
      <li v-for="(list, value) in Array.from(languages)">
        <a :class="{'is-active': languageSelected === list[0]}" @click="selectLanguage(list[0])">{{list[0] | capitalize}} <b-tag class="is-pulled-right" type="is-dark">{{list[1]}}</b-tag></a>
      </li>
    </ul>
  </aside>
</template>

<script>
import Vuex from 'vuex';

export default {
  name: 'cn-sidebar',
  data() {
    return {};
  },
  methods: {
    selectLanguage(language) {
      this.$store.dispatch('selectLanguage', language);
    },
  },
  computed: {
    ...Vuex.mapGetters(['languages', 'notes', 'languageSelected', 'totalFiles']),
  },
};
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  top: 48px;
  width: 22%;
  margin-top: 24px;

  li {
    margin: 5px 0;

    a {
      padding-bottom: 11px !important;
    }
  }
}
</style>
