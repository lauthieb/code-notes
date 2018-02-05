import db from '../../datastore-notes';

const state = {
  notes: [],
  languageSelected: 'all',
};

const mutations = {
  LOAD_NOTES(state, notes) {
    state.notes = notes;
  },
  ADD_NOTE(state, note) {
    state.notes.push(note);
  },
  DELETE_NOTE(state, note) {
    state.notes = state.notes.filter(n => n._id !== note._id);

    state.languageSelected = 'all';
  },
  SELECT_LANGUAGE(state, language) {
    state.languageSelected = language;
  },
};

const actions = {
  loadNotes(store) {
    return db.find({}, (err, notes) => {
      if (!err) {
        store.commit('LOAD_NOTES', notes);
      }
    });
  },
  addNote(store, note) {
    return db.insert(note, (err, note) => {
      if (!err) {
        store.commit('ADD_NOTE', note);
      }
    });
  },
  updateNote(store, note) {
    return db.update({ _id: note._id }, note, {}, err => {
      if (!err) {
        store.dispatch('loadNotes');
      }
    });
  },
  deleteNote(store, note) {
    return db.remove({ _id: note._id }, {}, err => {
      if (!err) {
        store.commit('DELETE_NOTE', note);
      }
    });
  },
  selectLanguage(store, language) {
    store.commit('SELECT_LANGUAGE', language);
  },
};

const getters = {
  notes: state => state.notes,
  noteById: state => id =>
    state.notes.find(note => note._id === id),
  languages: state => {
    const map = new Map();

    if (state.notes.length > 0) {
      state.notes.forEach(note => {
        Object.keys(note.files).forEach(key => {
          if (map.has(note.files[key].language)) {
            map.set(note.files[key].language, map.get(note.files[key].language) + 1);
          } else {
            map.set(note.files[key].language, 1);
          }
        });

      });
    }
    return map;
  },
  totalFiles() {
    let total = 0;

    state.notes.forEach(note => {
      total += Object.keys(note.files).length;
    });

    return total;
  },
  languageSelected: state => state.languageSelected,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
