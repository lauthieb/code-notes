<template>
  <div id="snippets-list">
    <div id="search-buttons" class="columns">
      <div class="column is-11">
        <b-field>
          <b-input placeholder="Search by name, description or language..."
                   v-model="searchField"
                   type="search"
                   icon="search">
          </b-input>
        </b-field>
      </div>
      <div class="column is-1">
        <button class="button is-dark is-pulled-right" @click="createSnippetModalActive = true">
          <b-icon icon="plus"></b-icon>
        </button>
      </div>
    </div>

    <div id="snippets" class="columns" v-for="snippet in snippetsFiltered">
      <div class="column is-12 is-6-fullhd snippet-card">
        <cb-snippet-card :snippet="snippet"></cb-snippet-card>
      </div>
    </div>

    <b-modal :active.sync="createSnippetModalActive" has-modal-card>
      <cb-create-snippet-modal></cb-create-snippet-modal>
    </b-modal>
  </div>
</template>

<script>
  import Vuex from 'vuex';
  import SnippetCard from './SnippetsList/SnippetCard';
  import CreateSnippetModal from './SnippetsList/CreateSnippetModal';

  export default {
    name: 'cb-snippets-list',
    components: {
      'cb-snippet-card': SnippetCard,
      'cb-create-snippet-modal': CreateSnippetModal
    },
    data() {
      return {
        searchField: '',
        createSnippetModalActive: false
      };
    },
    mounted() {
    },
    methods: { },
    computed: {
      ...Vuex.mapGetters(['snippets', 'snippetById', 'languageSelected']),
      snippetsFiltered() {
        const snippetsFiltered = this.snippets
          .filter(item => this.searchField
            .split(' ')
            .every(el => (item.name.indexOf(el) > -1) ||
              item.description.indexOf(el) > -1 ||
              item.language.indexOf(el) > -1));

        if (this.languageSelected !== 'all') {
          return snippetsFiltered
            .filter(snippet => snippet.language === this.languageSelected);
        }

        return snippetsFiltered;
      }
    },
    beforeRouteEnter(route, redirect, next) {
      next(vm => {
          vm.$store.dispatch('loadSnippets');
        }
      )
    }
  };
</script>

<style lang="scss" scoped>
  .snippet-card {
    padding: 0 12px;
  }

  .modal {
    z-index: 1100;
    text-align: center;
  }

  #snippets-list {
    margin-top: 72px;

    #search-buttons {
      position: fixed;
      top: 72px;
      width: 73.5%;
      z-index: 800;
      background-color: white;
    }

    #snippets {
      position: relative;
      top: 54px;
    }
  }
</style>
