<template src="./UpdateSnippetModal.html">

</template>

<script>
import editor from '../../editor/Editor';

export default {
  name: 'cb-update-snippet-modal',
  components: {
    editor,
  },
  props: {
    snippet: Object,
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
        'sh',
        'swift',
        'typescript',
        'xml',
      ],
    };
  },
  mounted() {
    this.$refs.snippetName.focus();
    this.code = Object.assign(this.snippet.content, {});
    this.snippetUpdated = { ...this.snippet };
    // this.snippetUpdated.tags = [...this.snippet.tags];
  },
  methods: {
    updateSnippet() {
      this.snippetUpdated.content = this.code;
      this.$store.dispatch('updateSnippet', this.snippetUpdated).then(() => {
        this.$store.dispatch('loadSnippets');
        this.$parent.close();
      });
    },
  },
  computed: {
    isDisabled() {
      return (
        !/\S/.test(this.snippetUpdated.name) ||
        !/\S/.test(this.snippetUpdated.language) ||
        !/\S/.test(this.code)
      );
    },
  },
};
</script>

<style src="./UpdateSnippetModal.scss" lang="scss">
</style>
