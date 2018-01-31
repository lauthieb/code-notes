<template src="./CreateSnippetModal.html">
</template>

<script>
import editor from '../../editor/Editor';
import languages from '../../../assets/data/languages.json';

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
      languages
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
