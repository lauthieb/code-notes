<template src="./SnippetsList.html">
</template>

<script>
import Vuex from 'vuex';
import SnippetCard from './snippet-card/SnippetCard';
import CreateSnippetModal from '../modals/create-snippet-modal/CreateSnippetModal';

export default {
  name: 'cb-snippets-list',
  components: {
    'cb-snippet-card': SnippetCard,
    'cb-create-snippet-modal': CreateSnippetModal,
  },
  data() {
    return {
      searchField: '',
      createSnippetModalActive: false,
    };
  },
  mounted() {},
  methods: {},
  computed: {
    ...Vuex.mapGetters(['snippets', 'snippetById', 'languageSelected']),
    snippetsFiltered() {
      const snippetsFiltered = this.snippets.filter(item =>
        this.searchField
          .split(' ')
          .every(
            el =>
              item.name.indexOf(el) > -1 ||
              item.description.indexOf(el) > -1 ||
              item.language.indexOf(el) > -1
          )
      );

      if (this.languageSelected !== 'all') {
        return snippetsFiltered.filter(
          snippet => snippet.language === this.languageSelected
        );
      }

      return snippetsFiltered;
    },
  },
  beforeRouteEnter(route, redirect, next) {
    next(vm => {
      vm.$store.dispatch('loadSnippets');
    });
  },
};
</script>

<style src="./SnippetsList.scss" lang="scss">
</style>
