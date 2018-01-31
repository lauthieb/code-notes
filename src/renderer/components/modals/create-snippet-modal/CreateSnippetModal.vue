<template src="./CreateSnippetModal.html">
</template>

<script>
import editor from '../../editor/Editor';

export default {
  name: 'cb-create-snippet-modal',
  components: {
    editor,
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
        'sh',
        'swift',
        'typescript',
        'xml',
      ],
    };
  },
  mounted() {
    this.$refs.snippetName.focus();
  },
  methods: {
    createSnippet() {
      this.$store.dispatch('addSnippet', this.snippet).then(() => {
        this.$parent.close();
      });
    },
  },
  computed: {
    isDisabled() {
      return (
        !/\S/.test(this.snippet.name) ||
        !/\S/.test(this.snippet.language) ||
        !/\S/.test(this.snippet.content)
      );
    },
  },
};
</script>

<style src="./CreateSnippetModal.scss" lang="scss">
</style>
