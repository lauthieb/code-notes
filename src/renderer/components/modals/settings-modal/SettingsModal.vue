<template src="./SettingsModal.html"> </template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'cn-settings-modal',
  data() {
    return {
      newSettings: {},
      helpTokenModalActive: false,
    };
  },
  mounted() {
    this.$refs.githubPersonalAccessToken.focus();
    this.newSettings = { ...this.settings };
  },
  methods: {
    ...mapActions(['setSettings']),
    save() {
      this.setSettings(this.newSettings);
      this.$parent.close();
    },
  },
  computed: {
    ...mapGetters(['settings']),
  },
};
</script>

<style src="./SettingsModal.scss" lang="scss"></style>
