<script>
import { mapGetters, mapActions } from 'vuex';
import editor from '@/components/editor/Editor';
import languages from '@/assets/data/languages.json';
import converter from '@/converter';

import Tab from '../../tab/Tab';

import { createId } from '../../../../utils';

const noteNameCharacters = 'abcdef0123456789';

const generateNoteName = () => {
  let text = '';
  for (let i = 0; i < 32; i += 1) {
    text += noteNameCharacters.charAt(Math.floor(Math.random() * 16));
  }
  return text;
};

export default {
  template: require('./CreateNoteModal.html'),
  name: 'cn-create-note-modal',
  components: { editor, Tab },
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
      files: [],

      baseFile: {
        name: '',
        language: 'text',
        content: '',
      },

      languages,
      displayDupError: false,
      selectedFile: null,
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
      this.files.push({ id: createId(), ...this.baseFile });

      Object.keys(this.baseFile).forEach(
          k => this.baseFile[k] = k !== 'language' ? '': this.languages[0].name)
        ;
    },
    deleteFile(file) {
      this.files = this.files.filter(f => f.id !== file.id);
      this.$refs.tab.recomputeSlidesLen();
      this.selectedFile = null;
    },
    containsDupFiles() {
      const map = new Map();
      let dupFiles = false;

      this.files.forEach((file) => {
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
  },
  computed: {
    ...mapGetters(['gistsSelected']),
    isDisabled() {
      return !this.files.length || this.files.some(file => !/\S/.test(file.content));
    },
  },
};
</script>

<style src="./CreateNoteModal.scss" lang="scss"></style>
