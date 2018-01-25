<template>
  <div id="wrapper">
    <h1>Snippets list</h1>
    <p>{{ JSON.stringify(docs) }}</p>
    <h3>{{docs.length}}</h3>
  </div>
</template>

<script>
import SnippetCard from './LandingPage/SnippetCard';

export default {
  name: 'snippets-list',
  components: { SnippetCard },
  data() {
    return {
      docs: [],
    };
  },
  mounted() {
    this.$db.insert({
      message: 'Hello db ! 1',
    });
    this.getLines();
  },
  methods: {
    getLines() {
      return this.$db.find({}, (err, docs) => {
        this.docs = docs;
      });
    },
  },
};
</script>

<style lang="scss">

</style>
