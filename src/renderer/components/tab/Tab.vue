<template src="./Tab.html"></template>

<script>
export default {
  data: () => ({
    tabWrapperWidth: null,
    tabInnerWith: null,
    tabSlidesLen: null,
    tabSlideIndex: 0
  }),

  props: {
    dataArr: {
      type: Array,
      require: true
    }
  },

  watch: {
    dataArr: {
      deep: true,

      // Adjust the witdh every time a file is added/deleted
      handler () {
        this.tabInnerWith = this.$refs.tabInner.offsetWidth;

        this.tabSlidesLen = Math.ceil(this.tabInnerWith / this.tabWrapperWidth) - 1;
      }
    }
  },

  methods: {
    changeSlide (direction) {
      if (direction === 'right') {
        this.tabSlideIndex++;
        const amount = this.tabSlideIndex * this.tabWrapperWidth;
        console.clear();
        this.$refs.tabInner.style.transform = `translateX(-${amount}px)`;
        return;
      }

      this.tabSlideIndex--;
      const amount = this.tabSlideIndex * this.tabWrapperWidth;
      this.$refs.tabInner.style.transform = `translateX(-${amount}px)`;
    },

    selectFile (item, ev) {
      /* Logic to select a file... */
    }
  },

  mounted () {

    this.tabWrapperWidth = this.$refs.tabWrapper.offsetWidth;
    this.tabInnerWith = this.$refs.tabInner.offsetWidth;

    this.tabSlidesLen = Math.ceil(this.tabInnerWith / this.tabWrapperWidth) - 1;

    console.log(this.tabWrapperWidth)
    console.log(this.tabInnerWith)
    console.log(this.tabSlidesLen)
  }
}
</script>


<style src="./Tab.scss" lang="scss"></style>
