<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create snippet</p>
      </header>

      <section class="modal-card-body">
        <b-field horizontal label="Name">
          <b-input
            type="text"
            ref="snippetName"
            v-model="snippet.name"
            placeholder="Your snippet name"
            d>
          </b-input>
        </b-field>

        <b-field horizontal label="Description">
          <b-input
            type="text"
            v-model="snippet.description"
            placeholder="Your snippet description">
          </b-input>
        </b-field>

        <b-field horizontal label="Language">
          <b-select placeholder="Select a language" v-model="snippet.language" d>
            <option
              v-for="language in languages"
              :value="language">
              {{ language | capitalize }}
            </option>
          </b-select>
        </b-field>

        <b-field horizontal label="Content">
          <editor v-model="snippet.content"
                  :lang="snippet.language"
                  theme="monokai"
                  width="100%"
                  height="260"
          ></editor>
        </b-field>

        <!--<b-field horizontal label="Tags">
          <b-taginput
            v-model="snippet.tags"
            icon="label"
            placeholder="Add a tag"
            maxtags="5">
          </b-taginput>
        </b-field>-->
      </section>

      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-primary" type="button" :disabled="isDisabled" @click="createSnippet()">Create</button>
      </footer>
    </div>
  </form>
</template>

<script>
  import editor from './Editor';

  export default {
    name: 'cb-create-snippet-modal',
    components: {
      editor
    },
    data() {
      return {
        snippet: {
          name: '',
          description: '',
          language: 'text',
          content: '',
          // tags: []
        },
        languages: [
          'text',
          'elixir',
          'elm',
          'golang',
          'haskell',
          'html',
          'java',
          'javascript',
          'json',
          'jsx',
          'jade',
          'makefile',
          'markdown',
          'ocaml',
          'perl',
          'pgsql',
          'php',
          'python',
          'ruby',
          'scss',
          'swift',
          'typescript',
          'xml'
        ]
      }
    },
    mounted() {
      this.$refs.snippetName.focus()
    },
    methods: {
      createSnippet() {
        this.$store.dispatch('addSnippet', this.snippet)
          .then(() => {
            this.$parent.close();
          });
      }
    },
    computed: {
      isDisabled() {
        return !/\S/.test(this.snippet.name) ||
          !/\S/.test(this.snippet.language) ||
          !/\S/.test(this.snippet.content);
      }
    }
  }
</script>

<style lang="scss">
  .modal-card {
    width: 700px;
  }

  .help {
    display: none !important;
  }
</style>
