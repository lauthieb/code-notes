import db from '../../datastore';

const state = {
  snippets: [],
  languageSelected: 'all',
};

const mutations = {
  LOAD_SNIPPETS(state, snippets) {
    state.snippets = snippets;
  },
  ADD_SNIPPET(state, snippet) {
    state.snippets.push(snippet);
  },
  DELETE_SNIPPET(state, snippet) {
    state.snippets = state.snippets.filter(s => s._id !== snippet._id);

    if (!state.snippets.some(s => s.language === snippet.language)) {
      state.languageSelected = 'all';
    }
  },
  SELECT_LANGUAGE(state, language) {
    state.languageSelected = language;
  },
};

const actions = {
  loadSnippets(store) {
    return db.find({}, (err, snippets) => {
      if (!err) {
        store.commit('LOAD_SNIPPETS', snippets);
      }
    });
  },
  addSnippet(store, snippet) {
    return db.insert(snippet, (err, snippet) => {
      if (!err) {
        store.commit('ADD_SNIPPET', snippet);
      }
    });
  },
  updateSnippet(store, snippet) {
    return db.update({ _id: snippet._id }, snippet, {}, err => {
      if (!err) {
        store.dispatch('loadSnippets');
      }
    });
  },
  deleteSnippet(store, snippet) {
    return db.remove({ _id: snippet._id }, {}, err => {
      if (!err) {
        store.commit('DELETE_SNIPPET', snippet);
      }
    });
  },
  selectLanguage(store, language) {
    store.commit('SELECT_LANGUAGE', language);
  },
};

const getters = {
  snippets: state => state.snippets,
  snippetById: state => id =>
    state.snippets.find(snippet => snippet._id === id),
  languages: state => {
    const map = new Map();

    if (state.snippets.length > 0) {
      state.snippets.forEach(snippet => {
        if (map.has(snippet.language)) {
          map.set(snippet.language, map.get(snippet.language) + 1);
        } else {
          map.set(snippet.language, 1);
        }
      });
    }
    return map;
  },
  languageSelected: state => state.languageSelected,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
