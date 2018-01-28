<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Update snippet</p>
      </header>

      <section class="modal-card-body">
        <b-field horizontal label="Name">
          <b-input
            type="text"
            ref="snippetName"
            v-model="snippetUpdated.name"
            placeholder="Your snippet name"
            required>
          </b-input>
        </b-field>

        <b-field horizontal label="Description">
          <b-input
            type="text"
            v-model="snippetUpdated.description"
            placeholder="Your snippet description">
          </b-input>
        </b-field>

        <b-field horizontal label="Language">
          <b-select placeholder="Select a language" v-model="snippetUpdated.language" required>
            <option
              v-for="language in languages"
              :value="language">
              {{ language | capitalize }}
            </option>
          </b-select>
        </b-field>

        <b-field horizontal label="Content">
          <editor v-model="code"
                  :lang="snippetUpdated.language"
                  theme="monokai"
                  width="100%"
                  height="260"
          ></editor>
        </b-field>

        <!--<b-field horizontal label="Tags">
          <b-taginput
            v-model="snippetUpdated.tags"
            icon="label"
            placeholder="Add a tag"
            maxtags="5">
          </b-taginput>
        </b-field>-->
      </section>

      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button is-primary" type="button" :disabled="isDisabled" @click="updateSnippet()">Update</button>
      </footer>
    </div>
  </form>
</template>

<script>
  import editor from './Editor';

  export default {
    name: 'cb-update-snippet-modal',
    components: {
      editor
    },
    props: {
      snippet: Object
    },
    data() {
      return {
        code: '',
        snippetUpdated: {
          name: '',
          description: '',
          language: '',
          content: '',
          // tags: []
        },
        languages: ['text', 'javascript', 'html']
      }
    },
    mounted() {
      this.$refs.snippetName.focus();
      this.code = Object.assign(this.snippet.content, {});
      this.snippetUpdated = {...this.snippet};
      // this.snippetUpdated.tags = [...this.snippet.tags];
    },
    methods: {
      updateSnippet() {
        this.snippetUpdated.content = this.code;
        this.$store.dispatch('updateSnippet', this.snippetUpdated)
          .then(() => {
            this.$store.dispatch('loadSnippets');
            this.$parent.close();
          });
      }
    },
    computed: {
      isDisabled() {
        return !/\S/.test(this.snippetUpdated.name) ||
          !/\S/.test(this.snippetUpdated.language) ||
          !/\S/.test(this.code);
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
