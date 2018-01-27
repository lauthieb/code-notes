<template>
  <div class="box">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <div id="card-header" class="columns">
            <div id="name-category" class="column is-10">
              <h4>{{snippet.name}} ({{snippet.language | capitalize}})</h4>
            </div>
            <div id="action-buttons" class="column is-2">
              <div class="is-pulled-right">
                <a id="update-snippet" @click="updateSnippetModalActive = true">
                  <b-icon icon="pencil"></b-icon>
                </a>
                <a id="delete-snippet" @click="deleteSnippet()">
                  <b-icon icon="trash"></b-icon>
                </a>
              </div>
            </div>
          </div>
          <p>{{snippet.description}}</p>
          <editor :code="snippet.content"
                  :lang="snippet.language"
                  theme="monokai"
                  width="100%"
                  height="260"
                  :readOnly="true"
          ></editor>
        </div>
      </div>
    </article>

    <b-modal :active.sync="updateSnippetModalActive" has-modal-card>
      <cb-update-snippet-modal :snippet="snippet"></cb-update-snippet-modal>
    </b-modal>
  </div>
</template>

<script>
  import editor from './Editor';
  import UpdateSnippetModal from './UpdateSnippetModal';

  export default {
    name: 'cb-snippet-card',
    components: {
      'cb-update-snippet-modal': UpdateSnippetModal,
      editor
    },
    props: {
      snippet: Object
    },
    data() {
      return {
        updateSnippetModalActive: false
      }
    },
    methods: {
      updateSnippet() {
        this.$store.dispatch('updateSnippet', this.snippet);
      },
      deleteSnippet() {
        this.$store.dispatch('deleteSnippet', this.snippet);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .box {
    margin: 16px 0;

    .media-content {
      overflow-x: hidden;
    }

    #card-header {
      margin-bottom: 0;

      #name-category {
        padding-bottom: 0;
      }

      #action-buttons {
        padding-bottom: 0;

        #delete-snippet {
          color: $danger;

          &:hover {
            color: lighten($black, 20%);
          }
        }
      }
    }

    .modal {
      z-index: 1100;
      text-align: center;
    }
  }

  .Code-Mirror-line {
    padding: 0;
  }
</style>
