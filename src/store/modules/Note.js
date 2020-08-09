import db from "@/datastore-notes";
import converter from "@/converter";
import path from "path";
import { remote } from "electron";
import { Octokit } from "@octokit/rest";
import packageJson from "../../../package";

const getOctokit = ({ githubPersonalAccessToken, githubEnterpriseUrl }) =>
  new Octokit({
    requestMedia: "application/vnd.github.v3+json",
    auth: githubPersonalAccessToken,
    headers: {
      userAgent: "code-notes".concat(packageJson.version),
      "user-agent": "octokit/rest.js v1.2.3",
      mediaType: {
        format: "application/vnd.github.v3+json"
      }
    },
    ...(githubEnterpriseUrl && { baseUrl: githubEnterpriseUrl })
  });

const state = {
  notes: [],
  languageSelected: "all",
  gistsSelected: false,
  isLoading: false
};

const mutations = {
  LOAD_NOTES(state, notes) {
    state.languageSelected = "all";

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
    state.languageSelected = "all";
  },
  SELECT_LANGUAGE(state, language) {
    state.languageSelected = language;
  },
  SELECT_GISTS(state, gistsSelected) {
    state.gistsSelected = gistsSelected;
  },
  SELECT_LOADING(state, loading) {
    state.isLoading = loading;
  }
};

const actions = {
  loadNotes(store) {
    if (store.state.gistsSelected) {
      if (store.rootState.Settings.settings.githubPersonalAccessToken) {
        store.commit("SELECT_LOADING", true);
        store.commit("LOAD_NOTES", []);

        const octokit = getOctokit(store.rootState.Settings.settings);

        octokit.gists.list().then(res => {
          const promises = [];

          res.data.forEach(gist => {
            promises.push(octokit.gists.get({ gist_id: gist.id }));
          });

          Promise.all(promises).then(values => {
            const notes = [];

            values.forEach(gistDetailed => {
              notes.push(converter.gistToNote(gistDetailed.data));
            });

            store.commit("LOAD_NOTES", notes);
            store.commit("SELECT_LOADING", false);
          });
        });
      } else {
        store.commit("LOAD_NOTES", []);
      }
    } else {
      store.commit("SELECT_LOADING", true);
      db.find({}, (err, notes) => {
        if (!err) {
          store.commit("LOAD_NOTES", notes);
          actions.writeNotesToFS(notes);
          store.commit("SELECT_LOADING", false);
        }
      });
    }
  },
  addNote(store, note) {
    store.commit("SELECT_LOADING", true);

    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.create(note).then(() => {
        store.dispatch("loadNotes");
      });
    } else {
      db.insert(note, (err, note) => {
        if (!err) {
          store.commit("ADD_NOTE", note);
          store.commit("SELECT_LOADING", false);
        }
      });
      actions.writeFileToFS(note, false);
    }
  },
  convertToGist(store, note) {
    const octokit = getOctokit(store.rootState.Settings.settings);
    return octokit.gists.create(converter.noteToGist(note));
  },
  updateNote(store, note) {
    if (store.state.gistsSelected) {
      const octokit = getOctokit(store.rootState.Settings.settings);

      octokit.gists
        .update({
          gist_id: note.id,
          files: note.files,
          description: note.description
        })
        .then(() => store.dispatch("loadNotes"));
    } else {
      db.update({ _id: note._id }, note, {}, err => {
        if (!err) {
          store.dispatch("loadNotes");
        }
      });
      actions.writeFileToFS(note, true);
    }
  },
  deleteNote(store, note) {
    store.commit("SELECT_LOADING", true);

    const octokit = getOctokit(store.rootState.Settings.settings);

    if (store.state.gistsSelected) {
      octokit.gists.delete({ gist_id: note.id }).then(() => {
        store.commit("DELETE_NOTE", note);
        store.commit("SELECT_LOADING", false);
      });
    } else {
      db.remove({ _id: note._id }, {}, err => {
        if (!err) {
          store.commit("DELETE_NOTE", note);
          store.commit("SELECT_LOADING", false);
        }
      });
      actions.deleNoteFromFS(note);
    }
  },
  writeNotesToFS(notes) {
    notes.forEach(note => {
      actions.writeFileToFS(note, true);
    });
  },
  writeFileToFS(note, updateIfExists) {
    const fs = require("fs-extra");
    const notesDir = path.join(remote.app.getPath("userData"), "notes");

    // Create folder for current note
    const curNoteDir = path.join(
      notesDir,
      `${note.name}-${note.createdAt.getTime()}`
    );
    if (!fs.existsSync(curNoteDir)) {
      fs.ensureDirSync(curNoteDir);
    }

    // Write each file to filesystem
    Object.entries(note.files).forEach(file => {
      const fileName = `${file[1].name}.${file[1].language}`;
      if (updateIfExists || !fs.pathExistsSync(fileName)) {
        fs.writeFileSync(
          path.join(curNoteDir, fileName),
          file[1].content,
          "utf-8"
        );
      }
    });

    // Write metadata to filesystem
    fs.writeFileSync(
      path.join(curNoteDir, "metadata.json"),
      JSON.stringify({
        description: note.description,
        public: note.public,
        updatedAt: note.updatedAt,
        createdAt: note.createdAt,
        tags: note.tags
      }),
      "utf-8"
    );
  },
  deleNoteFromFS(note) {
    const fs = require("fs-extra");
    const curNoteDir = path.join(
      remote.app.getPath("userData"),
      "notes",
      `${note.name}-${note.createdAt.getTime()}`
    );
    fs.removeSync(curNoteDir);
  },
  selectLanguage(store, language) {
    store.commit("SELECT_LANGUAGE", language);
  },
  selectGists(store, gists) {
    store.commit("SELECT_GISTS", gists);
    store.dispatch("loadNotes");
  }
};

const getters = {
  notes: state => state.notes,
  noteById: state => id => state.notes.find(note => note._id === id),
  languages: state => {
    const map = new Map();

    if (state.notes.length > 0) {
      state.notes.forEach(note => {
        Object.keys(note.files).forEach(key => {
          if (map.has(note.files[key].language)) {
            map.set(
              note.files[key].language,
              map.get(note.files[key].language) + 1
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

    state.notes.forEach(note => {
      total += Object.keys(note.files).length;
    });

    return total;
  },
  languageSelected: state => state.languageSelected,
  gistsSelected: state => state.gistsSelected,
  isLoading: state => state.isLoading
};

export default {
  state,
  mutations,
  actions,
  getters
};
