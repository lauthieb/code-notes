import db from '../../datastore';

const state = {
  snippets: [],
};

const mutations = {
  LOAD_SNIPPETS(state, snippets) {
    state.snippets = snippets;
  },
  ADD_SNIPPET(state, snippet) {
    state.snippets.push(snippet);
  },
  DELETE_SNIPPET(state, snippet) {
    state.snippets = state.snippets.filter(s => s._id !== snippet._id)
  }
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
    return db.update({_id: snippet._id}, snippet, {}, (err) => {
      if (!err) {
        store.dispatch('loadSnippets');
      }
    })
  },
  deleteSnippet(store, snippet) {
    return db.remove({_id: snippet._id}, {}, (err) => {
      if (!err) {
        store.commit('DELETE_SNIPPET', snippet);
      }
    });
  }
};

const getters = {
  snippets: (state) => state.snippets,
  snippetById: (state) => (id) => state.snippets.find(snippet => snippet._id === id)
};

export default {
  state,
  mutations,
  actions,
  getters,
};
