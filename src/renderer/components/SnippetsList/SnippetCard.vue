<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="box">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <div id="card-header" class="columns">
            <div id="name-category" class="column is-9">
              <h4>{{snippet.name}}</h4>
              <h5>({{snippet.language | capitalize}})</h5>
            </div>
            <div id="action-buttons" class="column is-3">
              <div class="is-pulled-right">
                <b-tooltip :active="showCopiedToClipboard" label="Copied !" position="is-bottom" always>
                  <a id="copy-snippet"
                     v-clipboard:copy="snippet.content"
                     v-clipboard:success="onCopyClipboardSuccess"
                     title="Copy to clipboard">
                    <b-icon icon="clipboard"></b-icon>
                  </a>
                </b-tooltip>
                <a id="update-snippet" @click="updateSnippetModalActive = true" title="Edit snippet">
                  <b-icon icon="pencil"></b-icon>
                </a>
                <a id="delete-snippet" @click="deleteSnippet()" title="Delete snippet">
                  <b-icon icon="trash"></b-icon>
                </a>
              </div>
            </div>
          </div>
          <p>{{snippet.description}}</p>
          <!--<b-taglist>
            <b-tag v-for="tag in snippet.tags" type="is-light">{{tag}}</b-tag>
          </b-taglist>-->
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
  import Vuex from 'vuex';
  import editor from './Editor';
  import UpdateSnippetModal from './UpdateSnippetModal';
  import BTooltip from '../../../../node_modules/buefy/src/components/tooltip/Tooltip.vue';

  export default {
    name: 'cb-snippet-card',
    components: {
      BTooltip,
      'cb-update-snippet-modal': UpdateSnippetModal,
      editor
    },
    props: {
      snippet: Object
    },
    data() {
      return {
        updateSnippetModalActive: false,
        showCopiedToClipboard: false
      }
    },
    computed: {
      ...Vuex.mapGetters(['snippets']),
    },
    methods: {
      updateSnippet() {
        this.$store.dispatch('updateSnippet', this.snippet);
      },
      deleteSnippet() {
        this.$dialog.confirm({
          title: 'Delete snippet',
          message: 'Are you sure you want to delete this snippet ?',
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.$store.dispatch('deleteSnippet', this.snippet);
          }
        });
      },
      onCopyClipboardSuccess() {
        this.showCopiedToClipboard = true;
        setTimeout(() => {
          this.showCopiedToClipboard = false;
        }, 1000);
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

    h5 {
      font-size: 14px;
      font-weight: 700;
    }

    p {
      font-size: 14px;
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

        #copy-snippet {
          color: $dark;

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
