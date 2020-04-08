import db from '@/datastore-notes';
import mysql from '@/mysql';
import converter from '@/converter';
import Octokit from '@octokit/rest';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import packageJson from '../../../../package';

const getOctokit = ({ githubPersonalAccessToken, githubEnterpriseUrl }) => new Octokit({
  requestMedia: 'application/vnd.github.v3+json',
  auth: githubPersonalAccessToken,
  headers: { userAgent: 'code-notes'.concat(packageJson.version),
    'user-agent': 'octokit/rest.js v1.2.3',
    mediaType: {
      format: 'application/vnd.github.v3+json',
    } },
  ...(githubEnterpriseUrl && { baseUrl: githubEnterpriseUrl }),
});

const state = {
  notes: [],
  languageSelected: 'all',
  gistsSelected: false,
  mysqlSelected: false,
  isLoading: false,
};

const mutations = {
  LOAD_NOTES(state, notes) {
    state.languageSelected = 'all';

    state.notes = notes;
  },
  ADD_NOTE(state, note) {
    state.notes.push(note);
  },
  DELETE_NOTE(state, note) {
    if (state.gistsSelected) {
      state.notes = state.notes.filter(n => n.id !== note.id);
    } else {
      state.notes = state.notes.filter(n => n._id !== note._id);
    }
    state.languageSelected = 'all';
  },
  SELECT_LANGUAGE(state, language) {
    state.languageSelected = language;
  },
  SELECT_GISTS(state, gistsSelected) {
    state.gistsSelected = gistsSelected;
  },
  SELECT_MYSQL(state, mysqlSelected) {
    state.mysqlSelected = mysqlSelected;
  },
  SELECT_LOADING(state, loading) {
    state.isLoading = loading;
  },
};

const actions = {
  loadNotes(store) {
    store.commit('SELECT_LOADING', true);
    store.commit('LOAD_NOTES', []);
    if (store.state.gistsSelected) {
      if (store.rootState.Settings.settings.githubPersonalAccessToken) {
        const octokit = getOctokit(store.rootState.Settings.settings);

        octokit.gists.list().then((res) => {
          const promises = [];

          res.data.forEach((gist) => {
            promises.push(octokit.gists.get({ gist_id: gist.id }));
          });

          Promise.all(promises).then((values) => {
            const notes = [];

            values.forEach((gistDetailed) => {
              notes.push(converter.gistToNote(gistDetailed.data));
            });

            store.commit('LOAD_NOTES', notes);
            store.commit('SELECT_LOADING', false);
          });
        });
      } else {
        store.commit('LOAD_NOTES', []);
      }
    } else {
      if (store.state.mysqlSelected) {
        const { mysqlHost, mysqlDB, mysqlUser, mysqlPassword } = store.rootState.Settings.database;
        const q = mysql.createConnection({
          host: mysqlHost,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDB,
        });
        q.query('SELECT id,note FROM `notes`', (err, rows, fields) => {
          if (err) {
            window.console.log('An error ocurred performing the query.');
            window.console.log(mysqlHost, mysqlDB, mysqlUser, mysqlPassword);
            window.console.log(err, fields);
            q.end(() => {});
            store.commit('SELECT_LOADING', false);
            return;
          }

          const results = [];

          rows.forEach((v) => {
            results.push(Object.assign({}, { id: v.id }, JSON.parse(v.note)));
          });

          window.console.log('database rows', results);
          store.commit('LOAD_NOTES', results);
        });
        q.end(() => {});
        store.commit('SELECT_LOADING', false);
        return;
      }

      db.find({}, (err, notes) => {
        if (!err) {
          store.commit('LOAD_NOTES', notes);
          actions.writeNotesToFS(notes);
          store.commit('SELECT_LOADING', false);
        }
      });
    }
  },
  addNote(store, note) {
    store.commit('SELECT_LOADING', true);
    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.create(note).then(() => {
        store.dispatch('loadNotes');
      });
    } else {
      if (store.state.mysqlSelected) {
        const { mysqlHost, mysqlDB, mysqlUser, mysqlPassword } = store.rootState.Settings.database;
        const q = mysql.createConnection({
          host: mysqlHost,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDB,
        });

        q.query('INSERT INTO notes SET note=?', JSON.stringify(note), (err, rows, fields) => {
          if (err) {
            window.console.log(err, fields);
            q.end();
            store.commit('SELECT_LOADING', false);
            return;
          }

          window.console.log('database rows', rows);
          store.dispatch('loadNotes');
        });
        q.end();
        store.commit('ADD_NOTE', note);
        store.commit('SELECT_LOADING', false);
        return;
      }

      db.insert(note, (err, note) => {
        if (!err) {
          store.commit('ADD_NOTE', note);
          store.commit('SELECT_LOADING', false);
        }
      });
      actions.writeFileToFS(note, false);
    }
  },
  updateNote(store, note) {
    store.commit('SELECT_LOADING', true);
    if (store.state.gistsSelected) {
      const octokit = getOctokit(store.rootState.Settings.settings);

      octokit.gists
        .update({
          gist_id: note.id,
          files: note.files,
          description: note.description,
        })
        .then(() => store.dispatch('loadNotes'));
    } else {
      if (store.state.mysqlSelected) {
        const { mysqlHost, mysqlDB, mysqlUser, mysqlPassword } = store.rootState.Settings.database;
        const q = mysql.createConnection({
          host: mysqlHost,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDB,
        });

        q.query('UPDATE notes SET note = ? WHERE id = ?', [JSON.stringify(note), note.id], (err, rows, fields) => {
          if (err) {
            window.console.log(err, fields);
            q.end();
            store.commit('SELECT_LOADING', false);
            return;
          }

          store.dispatch('loadNotes');
        });
        q.end();
        store.commit('SELECT_LOADING', false);
        return;
      }

      db.update({ _id: note._id }, note, {}, (err) => {
        if (!err) {
          store.dispatch('loadNotes');
        }
      });
      actions.writeFileToFS(note, true);
    }
  },
  deleteNote(store, note) {
    store.commit('SELECT_LOADING', true);

    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.delete({ gist_id: note.id }).then(() => {
        store.commit('DELETE_NOTE', note);
        store.commit('SELECT_LOADING', false);
      });
    } else {
      if (store.state.mysqlSelected) {
        const { mysqlHost, mysqlDB, mysqlUser, mysqlPassword } = store.rootState.Settings.database;
        const q = mysql.createConnection({
          host: mysqlHost,
          user: mysqlUser,
          password: mysqlPassword,
          database: mysqlDB,
        });

        q.query('DELETE FROM notes WHERE id = ?', note.id, (err, rows, fields) => {
          if (err) {
            window.console.log(err, fields);
            q.end();
            store.commit('SELECT_LOADING', false);
            return;
          }

          store.commit('DELETE_NOTE', note);
          store.dispatch('loadNotes');
        });
        q.end();
        store.commit('SELECT_LOADING', false);
        return;
      }

      db.remove({ _id: note._id }, {}, (err) => {
        if (!err) {
          store.commit('DELETE_NOTE', note);
          store.commit('SELECT_LOADING', false);
        }
      });
      actions.deleNoteFromFS(note);
    }
  },
  writeNotesToFS(notes) {
    notes.forEach((note) => {
      actions.writeFileToFS(note, true);
    });
  },
  writeFileToFS(note, updateIfExists) {
    const fs = require('fs-extra');
    const notesDir = path.join(remote.app.getPath('userData'), 'notes');

    // Create folder for current note
    const curNoteDir = path.join(notesDir, `${note.name}-${note.createdAt.getTime()}`);
    if (!fs.existsSync(curNoteDir)) {
      fs.ensureDirSync(curNoteDir);
    }

    // Write each file to filesystem
    Object.entries(note.files).forEach((file) => {
      const fileName = `${file[1].name}.${file[1].language}`;
      if (updateIfExists || !fs.exists(fileName)) {
        fs.writeFileSync(path.join(curNoteDir, fileName), file[1].content, 'utf-8');
      }
    });

    // Write metadata to filesystem
    fs.writeFileSync(path.join(curNoteDir, 'metadata.json'), JSON.stringify({
      description: note.description,
      public: note.public,
      updatedAt: note.updatedAt,
      createdAt: note.createdAt,
      tags: note.tags,
    }), 'utf-8');
  },
  deleNoteFromFS(note) {
    const fs = require('fs-extra');
    const curNoteDir = path.join(remote.app.getPath('userData'), 'notes', `${note.name}-${note.createdAt.getTime()}`);
    fs.removeSync(curNoteDir);
  },
  selectLanguage(store, language) {
    store.commit('SELECT_LANGUAGE', language);
  },
  selectGists(store, gists) {
    store.commit('SELECT_GISTS', gists);
    // prevent doubble loader
    if (!this.mysqlSelected) store.dispatch('loadNotes');
  },
  selectMysql(store, mysql) {
    store.commit('SELECT_MYSQL', mysql);
    // prevent doubble loader
    if (mysql) store.dispatch('loadNotes');
  },
};

const getters = {
  notes: state => state.notes,
  noteById: state => id => state.notes.find(note => note._id === id),
  languages: (state) => {
    const map = new Map();

    if (state.notes.length > 0) {
      state.notes.forEach((note) => {
        Object.keys(note.files).forEach((key) => {
          if (map.has(note.files[key].language)) {
            map.set(
              note.files[key].language,
              map.get(note.files[key].language) + 1,
            );
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

    state.notes.forEach((note) => {
      total += Object.keys(note.files).length;
    });

    return total;
  },
  languageSelected: state => state.languageSelected,
  gistsSelected: state => state.gistsSelected,
  isLoading: state => state.isLoading,
  mysqlSelected: state => state.mysqlSelected,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
