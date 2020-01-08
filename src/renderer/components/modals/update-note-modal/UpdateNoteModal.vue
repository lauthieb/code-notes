<script>
import { mapGetters, mapActions } from 'vuex';
import editor from '@/components/editor/Editor';
import languages from '@/assets/data/languages.json';
import converter from '@/converter';
import Tab from '../../tab/Tab';

import { createId } from '../../../utils';

export default {
  template: require('./UpdateNoteModal.html'),
  name: 'cn-update-note-modal',
  components: { editor, Tab },
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
        createdAt: null,
        tags: [],
      },
      files: [],
      gistFiles: [],
      languages,
      displayDupError: false,
      selectedFile: null,
      baseFile: {
        name: '',
        language: 'text',
        content: '',
      },
    };
  },
  mounted() {
    if (this.gistsSelected) {
      this.$refs.noteDescription.focus();
    } else {
      this.$refs.noteName.focus();
      this.note.tags = this.note.tags ? this.note.tags : [];
    }

    this.noteUpdated = { ...this.note };
    this.noteUpdated.files = {};
    Object.keys(this.note.files).forEach((key, index) => {
      this.files.push({ ...this.note.files[key], id: createId() });
      this.gistFiles.push({
        ...this.note.files[key],
        id: createId(),
        deleted: false,
      });
    });
  },
  methods: {
    ...mapActions(['updateNote']),
    updateNoteModal() {
      if (!this.containsDupFiles()) {
        if (this.gistsSelected) {
          this.files.forEach((file) => {
            if (file.added) {
              this.gistFiles.push(file);
            }
          });

          this.gistFiles.forEach((file, index) => {
            const key = converter.filenameToKey(file.name, file.language, this.getNoteType());

            if (file.deleted) {
              this.noteUpdated.files[key] = null;
            } else {
              this.noteUpdated.files[key] = this.files[index];

              const newFile = this.files.filter(f => f.id === file.id)[0];

              if (
                newFile.name !== file.name ||
                newFile.language !== file.language
              ) {
                this.noteUpdated.files[key].filename = `${
                  newFile.name
                }.${converter.languageToExtension(newFile.language)}`;
              }
            }
          });
        } else {
          this.files.forEach((file) => {
            const key = converter.filenameToKey(file.name, file.language, this.getNoteType());
            this.noteUpdated.files[key] = file;
          });
          this.noteUpdated.updatedAt = new Date();
        }

        this.updateNote(this.noteUpdated).then(() => {
          this.$parent.close();
        });
      } else {
        this.displayDupError = true;
      }
    },
    addFile() {
      this.files.push({
        id: createId(),
        ...this.baseFile,
        deleted: false,
        added: true,
      });

      Object.keys(this.baseFile).forEach(
        k => this.baseFile[k] = k !== 'language' ? '': this.languages[0].name
      );
    },
    deleteFile(file) {
      if (this.gistsSelected) {
        this.gistFiles.forEach((f, index) => {
          if (f.id === file.id) {
            this.gistFiles[index].deleted = true;
          }
        });
      }

      this.files = this.files.filter(f => f !== file);
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
      const isGistDisabled = () => (
        !/\S/.test(this.noteUpdated.description) ||
        this.files.some(file => !/\S/.test(file.name)) ||
        this.files.some(file => !/\S/.test(file.language)) ||
        this.files.some(file => !/\S/.test(file.content))
      );

      const isNoteDisabled = () => (
        isGistDisabled() || !/\S/.test(this.noteUpdated.name)
      );

      return this.gistsSelected ? isGistDisabled() : isNoteDisabled();
    },
  },
};
</script>

<style src="./UpdateNoteModal.scss" lang="scss"></style>
