<script>
import { mapGetters, mapActions } from 'vuex';
import NoteCard from './note-card/NoteCard';
import CreateNoteModal from '../modals/create-note-modal/CreateNoteModal';
import SettingsModal from '../modals/settings-modal/SettingsModal';
import HelpTokenModal from '../modals/help-token-modal/HelpTokenModal';

export default {
  template: require('./NotesList.html'),
  name: 'cn-notes-list',
  components: {
    'cn-note-card': NoteCard,
    'cn-create-note-modal': CreateNoteModal,
    'cn-help-token-modal': HelpTokenModal,
    'cn-settings-modal': SettingsModal,
  },
  data() {
    return {
      searchField: '',
      createNoteModalActive: false,
      settingsModalActive: false,
      helpTokenModalActive: false,
    };
  },
  methods: {
    ...mapActions(['loadNotes', 'loadSettings']),
  },
  computed: {
    ...mapGetters([
      'notes',
      'noteById',
      'languageSelected',
      'gistsSelected',
      'isLoading',
      'settings',
    ]),
    notesFiltered() {
      const notesFiltered = this.notes.filter(item =>
        this.searchField
          .split(' ')
          .every(el =>
            item.name.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              item.description.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              (item.tags
                ? item.tags.some(tag => tag.toLowerCase().indexOf(el.toLowerCase()) > -1)
                : false) ||
              Object.keys(item.files).some(key =>
                key.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
                  item.files[key].language
                    .toLowerCase()
                    .indexOf(el.toLowerCase()) > -1)));

      if (this.languageSelected !== 'all') {
        const notesFilteredByLanguage = [];

        notesFiltered.forEach((note) => {
          if (
            Object.keys(note.files).some(key => note.files[key].language === this.languageSelected)
          ) {
            notesFilteredByLanguage.push(note);
          }
        });

        return notesFilteredByLanguage;
      }

      return notesFiltered;
    },
  },
  beforeRouteEnter(route, redirect, next) {
    next((vm) => {
      vm.loadNotes();
      vm.loadSettings();
    });
  },
};
</script>

<style src="./NotesList.scss" lang="scss"></style>
