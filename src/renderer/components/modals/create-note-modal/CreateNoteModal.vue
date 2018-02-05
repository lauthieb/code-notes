<template src="./CreateNoteModal.html">
</template>

<script>
  import editor from '../../editor/Editor';
  import languages from '../../../assets/data/languages.json';
  import converter from '../../../converter';

  export default {
    name: 'cn-create-note-modal',
    components: {
      editor,
    },
    data() {
      return {
        note: {
          name: '',
          description: '',
          files: {},
          updatedAt: null,
          createdAt: null
        },
        files: [{
          name: '',
          language: 'text',
          content: ''
        }],
        languages,
        displayDupError: false
      };
    },
    mounted() {
      this.$refs.noteName.focus();
    },
    methods: {
      createNote() {
        if (!this.containsDupFiles()) {
          this.files.forEach(file => {
            this.note.files[`${file.name}-${converter.languageToExtension(file.language)}`] = file;
          });

          this.note.createdAt = new Date();
          this.note.updatedAt = new Date();

          this.$store.dispatch('addNote', this.note).then(() => {
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
          !/\S/.test(this.note.name) ||
          this.files.some(file => !/\S/.test(file.name) || !/\S/.test(file.language) || !/\S/.test(file.content))
        );
      },
    },
  };
</script>

<style src="./CreateNoteModal.scss" lang="scss">
</style>
