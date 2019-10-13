<template src="./Editor.html"> </template>

<script>
import ace from 'brace';
import emmet from 'emmet';

window.emmet = emmet;

export default {
  name: 'editor',
  props: {
    code: String,
    value: String,
    lang: String,
    theme: String,
    height: true,
    width: true,
    readOnly: Boolean,
    autoGrow: Boolean,
  },
  data() {
    return {
      editor: null,
      contentBackup: '',
      fullScreen: false,
    };
  },
  computed: {
    editorHeight() {
      if (this.autoGrow && !this.fullScreen) return undefined;
      if (this.height && !this.fullScreen) return this.px(this.height);
      return '100%'
    },
    editorStyle() {
      return {
        width: this.width && !this.fullScreen ? this.px(this.width) : '100%',
        height: this.editorHeight,
      }
    },
  },
  methods: {
    px(n) {
      if (/^\d*$/.test(n)) {
        return `${n}px`;
      }
      return n;
    },
    toggleFullscreen() {
      this.fullScreen = !this.fullScreen;
      this.editor.resize();
    }
  },
  watch: {
    value(val) {
      if (this.contentBackup !== val) this.editor.setValue(val, 1);
    },
    code(val) {
      if (this.contentBackup !== val) this.editor.setValue(val, 1);
    },
    lang(val) {
      this.editor.getSession().setMode(`ace/mode/${val}`);
    },
  },
  mounted() {
    const vm = this;
    const lang = this.lang || 'text';
    const theme = this.theme || 'chrome';

    require('brace/ext/emmet');

    const editor = (vm.editor = ace.edit(this.$refs.editor));

    this.$emit('init', editor);

    editor.$blockScrolling = Infinity;
    editor.setOption('enableEmmet', true);
    editor.setOption('fontSize', '1rem');
    editor.getSession().setMode(`ace/mode/${lang}`);
    editor.setTheme(`ace/theme/${theme}`);
    editor.setShowPrintMargin(false);

    if (!this.readOnly) {
      editor.setValue(this.value, 1);
    } else {
      editor.setValue(this.code, 1);
    }
    editor.setReadOnly(this.readOnly);
    if(this.autoGrow) {
      editor.setOption('maxLines', Infinity);
    }

    editor.on('change', () => {
      const content = editor.getValue();
      vm.$emit('input', content);
      vm.contentBackup = content;
    });
  },
};
</script>

<style src="./Editor.scss" lang="scss"></style>
