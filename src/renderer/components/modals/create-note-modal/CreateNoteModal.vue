<template src="./CreateNoteModal.html">
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import editor from '@/components/editor/Editor';
  import languages from '@/assets/data/languages.json';
  import converter from '@/converter';

  export default {
    name: 'cn-create-note-modal',
    components: { editor },
    data() {
      return {
        note: {
          name: '',
          description: '',
          files: {},
          public: false,
          updatedAt: null,
          createdAt: null,
          tags: [],
        },
        files: [
          {
            name: '',
            language: 'text',
            content: '',
          },
        ],
        languages,
        displayDupError: false,
      };
    },
    mounted() {
      if (this.gistsSelected) {
        this.$refs.noteDescription.focus();
      } else {
        this.$refs.noteName.focus();
      }
    },
    methods: {
      ...mapActions(['addNote']),
      createNote() {
        if (!this.containsDupFiles()) {
          let separator = '-';

          if (this.gistsSelected) {
            separator = '.';
          }

          this.files.forEach(file => {
            this.note.files[
              `${file.name}${separator}${converter.languageToExtension(
                file.language
              )}`
            ] = file;
          });
          this.note.createdAt = new Date();
          this.note.updatedAt = new Date();

          this.addNote(this.note).then(() => {
            this.$parent.close();
          });
        } else {
          this.displayDupError = true;
        }
      },
      addFile() {
        this.files.push({
          name: '',
          language: 'text',
          content: '',
        });
      },
      deleteFile(file) {
        this.files = this.files.filter(f => f !== file);
      },
      containsDupFiles() {
        const map = new Map();
        let dupFiles = false;

        this.files.forEach(file => {
          const key = `${file.name}.${converter.languageToExtension(
            file.language
          )}`;

          if (map.has(key)) {
            dupFiles = true;
          }

          map.set(key, 1);
        });

        return dupFiles;
      },
    },
    computed: {
      ...mapGetters(['gistsSelected']),
      isDisabled() {
        if (this.gistsSelected) {
          return this.files.some(
            file =>
              !/^[^.]*$/.test(file.name) ||
              !/\S/.test(file.name) ||
              !/\S/.test(file.language) ||
              !/\S/.test(file.content)
          );
        }

        return (
          !/\S/.test(this.note.name) ||
          this.files.some(
            file =>
              !/^[^.]*$/.test(file.name) ||
              !/\S/.test(file.name) ||
              !/\S/.test(file.language) ||
              !/\S/.test(file.content)
          )
        );
      },
    },
  };
</script>

<style src="./CreateNoteModal.scss" lang="scss">
</style>
