import db from "@/datastore-settings";

const state = {
  settings: {}
};

const mutations = {
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  }
};

const actions = {
  loadSettings(store) {
    return db
      .find({})
      .limit(1)
      .exec((err, settings) => {
        if (!err && settings.length === 0) {
          db.insert({}, err => {
            if (!err) {
              db.find({})
                .limit(1)
                .exec((err, settings) => {
                  store.commit("SET_SETTINGS", settings["0"]);
                  store.dispatch("loadNotes");
                });
            }
          });
        } else {
          store.commit("SET_SETTINGS", settings["0"]);
          store.dispatch("loadNotes");
        }
      });
  },
  setSettings(store, settings) {
    return db.update({ _id: settings._id }, settings, {}, err => {
      if (!err) {
        store.dispatch("loadSettings");
      }
    });
  }
};

const getters = {
  settings: state => state.settings,
  githubToken: state => state.settings.githubPersonalAccessToken
};

export default {
  state,
  mutations,
  actions,
  getters
};
