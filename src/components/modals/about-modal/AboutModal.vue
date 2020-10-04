<template>
  <div class="modal-card">
    <div class="modal-card-body">
      <div class="media">
        <div class="media-content">
          <img src="~@/assets/img/code-notes-logo-black-full.png" alt="Image" />
        </div>
      </div>
      <div class="text-center">
        <h4>v{{ appVersion }}</h4>

        <p>
          A simple code snippet manager for developers built with Electron &
          Vue.js 🚀
        </p>

        <p>
          Feel free to contribute on
          <a @click="open('https://github.com/lauthieb/code-notes')">Github</a>
          🍻
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { remote } from "electron";
export default {
  name: "cn-about-modal",
  data() {
    return {
      appVersion: remote.app.getVersion()
    };
  }, 
  methods:{
    open: function(link) {
    window.open(link, "_blank");
    }
  }
};
</script>

<style src="./AboutModal.scss" lang="scss"></style>
