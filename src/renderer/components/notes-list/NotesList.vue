<template src="./NotesList.html">
</template>

<script>
import Vuex from 'vuex';
import NoteCard from './note-card/NoteCard';
import CreateNoteModal from '../modals/create-note-modal/CreateNoteModal';

export default {
  name: 'cn-notes-list',
  components: {
    'cn-note-card': NoteCard,
    'cn-create-note-modal': CreateNoteModal,
  },
  data() {
    return {
      searchField: '',
      createNoteModalActive: false,
    };
  },
  mounted() {},
  methods: {},
  computed: {
    ...Vuex.mapGetters(['notes', 'noteById', 'languageSelected']),
    notesFiltered() {
      const notesFiltered = this.notes.filter(item =>
        this.searchField
          .split(' ')
          .every(
            el =>
              item.name.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              item.description.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              Object.keys(item.files)
                .some(key => key.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
                    item.files[key].language.toLowerCase().indexOf(el.toLowerCase()) > -1)
          )
      );

      if (this.languageSelected !== 'all') {
        const notesFilteredByLanguage = [];

        notesFiltered.forEach(note => {
          if (Object.keys(note.files)
              .some(key => note.files[key].language === this.languageSelected)) {
            notesFilteredByLanguage.push(note);
          }
        });

        return notesFilteredByLanguage;
      }

      return notesFiltered;
    },
  },
  beforeRouteEnter(route, redirect, next) {
    next(vm => {
      vm.$store.dispatch('loadNotes');
    });
  },
};
</script>

<style src="./NotesList.scss" lang="scss">
</style>
