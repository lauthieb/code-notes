<template src="./SettingsModal.html">
</template>

<script>
  import Vuex from 'vuex';

  export default {
    name: 'cn-settings-modal',
    components: {},
    data() {
      return {
        newSettings: {},
        helpTokenModalActive: false
      };
    },
    mounted() {
      this.$refs.githubPersonalAccessToken.focus();
      this.newSettings = {...this.settings}
    },
    methods: {
      save() {
        this.$store.dispatch('setSettings', this.newSettings);
        this.$parent.close();
      }
    },
    computed: {
      ...Vuex.mapGetters(['settings']),
    },
  };
</script>

<style src="./SettingsModal.scss" lang="scss">
</style>
