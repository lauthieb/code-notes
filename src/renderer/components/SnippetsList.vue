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
    <div id="snippets" v-for="snippet in snippetsFiltered">
      <cb-snippet-card :snippet="snippet"></cb-snippet-card>
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
    methods: {},
    computed: {
      ...Vuex.mapGetters(['snippets', 'snippetById']),
      snippetsFiltered() {
        return this.snippets
          .filter(item => this.searchField
            .split(' ')
            .every(el => (item.name.indexOf(el) > -1) ||
              item.description.indexOf(el) > -1 ||
              item.language.indexOf(el) > -1));
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
  .modal {
    z-index: 1100;
    text-align: center;
  }

  #snippets-list {
    margin-top: 74px;

    #search-buttons {
      position: fixed;
      //width: 73.5%; when there's the sidebar
      width: 98%;
      z-index: 800;
      background-color: white;
    }

    #snippets {
      position: relative;
      top: 54px;
    }
  }
</style>
