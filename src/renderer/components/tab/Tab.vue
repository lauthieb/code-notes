<script>
export default {
  template: require('./Tab.html'),

  data: () => ({
    tabWrapperWidth: null,
    tabInnerWidth: null,
    tabSlidesLen: null,
    tabSlideIndex: 0,
    selectedFile: null,
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
      handler (newVal, oldVal) {
        this.recomputeSlidesLen();
      }
    },

    tabSlidesLen (len) {
      if (len <= this.tabSlideIndex) {
        this.tabSlideIndex = len === 0 ? 0 : len - 1;
        this.$refs.tabInner.style.transform = 'translateX(0)';
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
      // Toggle
      if (this.selectedFile && this.selectedFile.id === item.id) {
        this.selectedFile = null;
      } else {
        this.selectedFile = item;
      }

      this.$emit('onFileSelected', this.selectedFile);
    },

    recomputeSlidesLen () {
      this.$nextTick(() => {
        if (this.$refs.tabWrapper === undefined) {
          // All the files have been deleted
          this.tabSlidesLen = 0;

          return;
        }

        this.tabWrapperWidth = this.$refs.tabWrapper.offsetWidth;
        this.tabInnerWidth = this.$refs.tabInner.offsetWidth;
        this.tabSlidesLen = Math.ceil(this.tabInnerWidth / this.tabWrapperWidth) - 1;
      })
    }
  },

  mounted () {

    this.recomputeSlidesLen();
  }
}
</script>


<style src="./Tab.scss" lang="scss"></style>
