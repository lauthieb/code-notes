<template>
  <form action="">
    <div id="settings-modal" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Settings</p>
      </header>

      <section class="modal-card-body">
        <b-field label="Github Enterprise Users Only">
          <b-input
            type="text"
            ref="githubEnterpriseUrl"
            v-model="newSettings.githubEnterpriseUrl"
            placeholder="https://github.host/api/v3"
          >
          </b-input>
        </b-field>
        <b-field label="Personal access token">
          <b-input
            type="password"
            password-reveal
            ref="githubPersonalAccessToken"
            v-model="newSettings.githubPersonalAccessToken"
            placeholder="Your Github personal access token"
          >
          </b-input>
        </b-field>
      </section>

      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">
          Cancel
        </button>
        <button class="button is-primary" type="button" @click="save()">
          Save
        </button>
      </footer>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "cn-settings-modal",
  data() {
    return {
      newSettings: {},
      helpTokenModalActive: false
    };
  },
  mounted() {
    this.$refs.githubPersonalAccessToken.focus();
    this.newSettings = { ...this.settings };
  },
  methods: {
    ...mapActions(["setSettings"]),
    save() {
      this.setSettings(this.newSettings);
      this.$parent.close();
    }
  },
  computed: {
    ...mapGetters(["settings"])
  }
};
</script>

<style src="./SettingsModal.scss" lang="scss"></style>
