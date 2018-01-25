<template>
  <aside class="menu">
    <p class="menu-label">
      Languages
    </p>
    <ul class="menu-list">
      <li><a class="is-active">All</a></li>
      <li><a>Text</a></li>
      <li><a>JavaScript</a></li>
    </ul>
    <p class="menu-label">
      Tags
    </p>
    <b-taglist>
      <b-tag type="is-light">First</b-tag>
      <b-tag type="is-light">Second</b-tag>
      <b-tag type="is-light">Third</b-tag>
      <b-tag type="is-light">Fourth</b-tag>
      <b-tag type="is-light">Fifth</b-tag>
    </b-taglist>
  </aside>
</template>

<script>
  export default {
    name: 'cb-sidebar',
    data() {
      return {}
    }
  };
</script>

<style lang="scss" scoped>
  aside {
    position: fixed;
    top: 50px;
    width: 22%;
    margin-top: 18px;

    li {
      margin: 5px 0;
    }
  }
</style>
