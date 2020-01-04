<template src="./CreateNoteModal.html"> </template>

<script>
import { mapGetters, mapActions } from 'vuex';
import editor from '@/components/editor/Editor';
import languages from '@/assets/data/languages.json';
import converter from '@/converter';
import vSelect from 'vue-select';
import ColorHash from 'color-hash';

const noteNameCharacters = 'abcdef0123456789';

const generateNoteName = () => {
  let text = '';
  for (let i = 0; i < 32; i += 1)
    text += noteNameCharacters.charAt(Math.floor(Math.random() * 16));
  return text;
};

export default {
  name: 'cn-create-note-modal',
  components: { editor, vSelect },
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
        const noteType = this.getNoteType();

        this.files.forEach((file, i) => {
          const filename = file.name || `${noteType}file${i + 1}`;
          const key = converter.filenameToKey(filename, file.language, noteType);
          this.note.files[key] = file;
        });
        this.note.createdAt = new Date();
        this.note.updatedAt = new Date();

        if (!this.note.name || this.note.name.trim() === '') {
          this.note.name = `${noteType}:${generateNoteName()}`;
        }

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
        const key = converter.filenameToKey(file.name, file.language, this.getNoteType());

        if (map.has(key)) {
          dupFiles = true;
        }

        map.set(key, 1);
      });

      return dupFiles;
    },
    getNoteType() {
      return (this.gistsSelected) ? 'gist' : 'note';
    },
    stringToColour(str) {
      const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.6 });
      return colorHash.hex(str);
    },
  },
  computed: {
    ...mapGetters(['gistsSelected', 'notes']),
    isDisabled() {
      let isCreateButtonDisabled = false;

      if(this.getNoteType() === "gist"){
        if(this.files.some(file => !/\S/.test(file.content))   ||
         this.files.some(file => !/\S/.test(file.name))      ||
         this.files.some(file => !/\S/.test(this.note.description))){
           isCreateButtonDisabled = true;
         } else {
           isCreateButtonDisabled = false;
         }
      } if(this.getNoteType() === "note"){
          if(this.files.some(file => !/\S/.test(file.content))   ||
          this.files.some(file => !/\S/.test(file.name))      ||
          this.files.some(file => !/\S/.test(this.note.name)) ||
          this.files.some(file => !/\S/.test(this.note.description))){
            isCreateButtonDisabled = true;
          } else {
            isCreateButtonDisabled = false;
          }
      }
      return isCreateButtonDisabled;
    },
    sortedLanguagesByUse() {
      this.languages.forEach((language) => { language.frequency = 0; });
      this.notes.forEach((note) => {
        Object.keys(note.files).forEach((file) => {
          const languageUsed = this.languages.find(language =>
            note.files[file].language === language.name);
          languageUsed.frequency ? (languageUsed.frequency += 1)
            : (languageUsed.frequency = 1);
        });
      });
      const sortedArray = this.languages
        .slice()
        .sort((a, b) =>
          (a.frequency > b.frequency ? -1 : a.frequency < b.frequency ? 1 : 0));
      return sortedArray;
    },
  },
};
</script>

<style src="./CreateNoteModal.scss" lang="scss"></style>
<style src="vue-select/dist/vue-select.css"></style>
