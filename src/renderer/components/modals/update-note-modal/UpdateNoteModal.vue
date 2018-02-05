<template src="./UpdateNoteModal.html">

</template>

<script>
import editor from '../../editor/Editor';
import languages from '../../../assets/data/languages.json';
import converter from '../../../converter';

export default {
  name: 'cn-update-note-modal',
  components: {
    editor,
  },
  props: {
    note: Object,
  },
  data() {
    return {
      noteUpdated: {
        name: '',
        description: '',
        files: {},
        updatedAt: null,
        createdAt: null
      },
      files: [],
      languages,
      displayDupError: false
    };
  },
  mounted() {
    this.$refs.noteName.focus();
    this.noteUpdated = { ...this.note };
    this.noteUpdated.files = {};
    Object.keys(this.note.files).forEach(key => {
      this.files.push({...this.note.files[key]});
    })
  },
  methods: {
    updateNote() {
      if (!this.containsDupFiles()) {
        this.files.forEach(file => {
          this.noteUpdated.files[file.name] = file;
        });

        this.note.updatedAt = new Date();

        this.$store.dispatch('updateNote', this.noteUpdated).then(() => {
          this.$store.dispatch('loadNotes');
          this.$parent.close();
        });
      }
      else {
        this.displayDupError = true;
      }
    },
    addFile() {
      this.files.push({
        name: '',
        language: 'text',
        content: ''
      });
    },
    deleteFile(file) {
      this.files = this.files.filter(f => f !== file);
    },
    containsDupFiles() {
      const map = new Map();
      let dupFiles = false;

      this.files.forEach(file => {
        const key = `${file.name}.${converter.languageToExtension(file.language)}`;

        if (map.has(key)) {
          dupFiles = true;
        }
        map.set(key, 1);
      });

      return dupFiles;
    }
  },
  computed: {
    isDisabled() {
      return (
        !/\S/.test(this.noteUpdated.name) ||
        this.files.some(file => !/\S/.test(file.name) || !/\S/.test(file.language) || !/\S/.test(file.content))
      );
    },
  },
};
</script>

<style src="./UpdateNoteModal.scss" lang="scss">
</style>
