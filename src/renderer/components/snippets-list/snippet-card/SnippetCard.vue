<template src="./SnippetCard.html">
</template>

<script>
import Vuex from 'vuex';
import editor from '../../editor/Editor';
import UpdateSnippetModal from '../../modals/update-snippet-modal/UpdateSnippetModal';
import BTooltip from '../../../../../node_modules/buefy/src/components/tooltip/Tooltip.vue';

export default {
  name: 'cb-snippet-card',
  components: {
    BTooltip,
    'cb-update-snippet-modal': UpdateSnippetModal,
    editor,
  },
  props: {
    snippet: Object,
  },
  data() {
    return {
      updateSnippetModalActive: false,
      showCopiedToClipboard: false,
    };
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
        },
      });
    },
    onCopyClipboardSuccess() {
      this.showCopiedToClipboard = true;
      setTimeout(() => {
        this.showCopiedToClipboard = false;
      }, 1000);
    },
  },
};
</script>

<style src="./SnippetCard.scss" lang="scss">
</style>
