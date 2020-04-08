import db from '@/datastore-settings';
import mysql from '@/datastore-database';

const state = {
  settings: {},
  database: {},
};

const mutations = {
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },
  SET_DATABASE(state, database) {
    state.database = database;
  },
};

const actions = {
  loadSettings(store) {
    return db
      .find({})
      .limit(1)
      .exec((err, settings) => {
        if (!err && settings.length === 0) {
          db.insert({}, (err) => {
            if (!err) {
              db.find({})
                .limit(1)
                .exec((err, settings) => {
                  store.commit('SET_SETTINGS', settings['0']);
                  store.dispatch('loadNotes');
                  const html = document.getElementsByTagName('html')[0];
                  switch (settings['0'].theme) {
                    default: html.setAttribute('class', ''); break;
                    case 'dark': html.setAttribute('class', 'dark'); break;
                  }
                });
            }
          });
        } else {
          store.commit('SET_SETTINGS', settings['0']);
          store.dispatch('loadNotes');
          const html = document.getElementsByTagName('html')[0];
          switch (settings['0'].theme) {
            default: html.setAttribute('class', ''); break;
            case 'dark': html.setAttribute('class', 'dark'); break;
          }
        }
      });
  },
  loadDatabase(store) {
    return mysql
      .find({})
      .limit(1)
      .exec((err, database) => {
        if (!err && database.length === 0) {
          mysql.insert({}, (err) => {
            if (!err) {
              mysql.find({})
                .limit(1)
                .exec((err, database) => {
                  window.console.log('exec data', database['0']);
                  store.commit('SET_DATABASE', database['0']);
                  store.dispatch('loadNotes');
                });
            }
          });
        } else {
          store.commit('SET_DATABASE', database['0']);
          store.dispatch('loadNotes');
        }
      });
  },
  setSettings(store, settings) {
    return db.update({ _id: settings._id }, settings, {}, (err) => {
      if (!err) {
        store.dispatch('loadSettings');
      }
    });
  },
  setDatabase(store, database) {
    window.console.log('database', database);
    return mysql.update({ _id: database._id }, database, {}, (err) => {
      window.console.log('database err', database, err);
      if (!err) {
        store.dispatch('loadDatabase');
      }
    });
  },
};

const getters = {
  settings: state => state.settings,
  database: state => state.database,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
