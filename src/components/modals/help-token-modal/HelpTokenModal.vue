<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Help - Create a personal access token</p>
    </header>
    <section class="modal-card-body">
      <img src="~@/assets/img/help-token.png" />
    </section>

    <footer class="modal-card-foot">
      <button class="button is-primary" type="button" @click="$parent.close()">
        Ok, thanks !
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "cn-help-token-modal"
};
</script>

<style src="./HelpTokenModal.scss" lang="scss"></style>
