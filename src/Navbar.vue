<template>
  <nav>
    <img
      class="logo"
      src="~@/assets/img/code-notes-logo-white-full.png"
      alt="Code Notes logo"
    />

    <div class="is-pulled-right">
      <a
        id="github"
        @click="open('https://github.com/lauthieb/code-notes')"
        title="Github"
      >
        <b-icon icon="github"></b-icon>
      </a>
    </div>

    <div class="is-pulled-right">
      <a id="help" @click="aboutModalActive = true" title="About">
        <b-icon icon="info-circle"></b-icon>
      </a>
    </div>

    <div class="is-pulled-right">
      <a id="help" @click="helpTokenModalActive = true" title="Help">
        <b-icon icon="question-circle"></b-icon>
      </a>
    </div>

    <b-modal :active.sync="aboutModalActive" has-modal-card>
      <cn-about-modal></cn-about-modal>
    </b-modal>

    <b-modal :active.sync="helpTokenModalActive" has-modal-card>
      <cn-help-token-modal></cn-help-token-modal>
    </b-modal>
  </nav>
</template>

<script>
// eslint-disable-next-line
import { remote } from "electron";
import HelpTokenModal from "./components/modals/help-token-modal/HelpTokenModal";
import AboutModal from "./components/modals/about-modal/AboutModal";

export default {
  name: "cn-navbar",
  components: {
    "cn-help-token-modal": HelpTokenModal,
    "cn-about-modal": AboutModal
  },
  data() {
    return {
      helpTokenModalActive: false,
      aboutModalActive: false
    };
  },
  methods: {
    open: function(link) {
    window.open(link, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  -webkit-app-region: drag;
  background-color: $primary;
  text-align: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;

  .logo {
    padding: 10px 10px 4px 10px;
    width: 110px;
    position: relative;
    left: 4%;
  }

  #about-code-notes,
  #github,
  #help {
    color: $light;
    position: relative;
    top: 20px;
    right: 20px;
  }

  .modal {
    .media-content {
      text-align: center;
    }

    img {
      width: 250px;
    }

    .badge {
      width: 160px;
    }
  }
}
</style>
