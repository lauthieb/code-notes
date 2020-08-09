<template>
  <form action="" class="create-modal modal-form">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Create {{ gistsSelected ? "gist" : "note" }}
        </p>
        <h2 class="text-red" v-if="displayDupError">
          Oh sorry, you can't have duplicated name in your note files...
        </h2>
      </header>

      <section class="modal-card-body">
        <b-field v-if="!gistsSelected" horizontal label="Name">
          <b-input
            type="text"
            ref="noteName"
            v-model="note.name"
            placeholder="Your note name"
            required
          >
          </b-input>
        </b-field>

        <b-field horizontal label="Description">
          <b-input
            type="text"
            ref="noteDescription"
            v-model="note.description"
            placeholder="Your description"
            required
          >
          </b-input>
        </b-field>

        <b-field v-if="!gistsSelected" horizontal label="Tags">
          <b-taginput v-model="note.tags" maxtags="5"> </b-taginput>
        </b-field>

        <b-field v-if="gistsSelected" horizontal label="Visibility">
          <b-select placeholder="Select a visibility" v-model="note.public">
            <option :value="false">Secret</option>
            <option :value="true">Public</option>
          </b-select>
        </b-field>

        <div class="note-file" v-for="(file, index) in files" :key="index">
          <b-field horizontal label="Name" grouped>
            <b-input
              style="width: 186px"
              type="text"
              v-model="file.name"
              placeholder="Your file name"
              required
            >
            </b-input>
            <p class="control is-pulled-right" v-if="files.length > 1">
              <button class="button is-danger" @click="deleteFile(file)">
                <b-icon icon="trash"></b-icon>
              </button>
            </p>
          </b-field>

          <b-field horizontal label="Language">
            <v-select
              style="width: 186px"
              label="name"
              :options="sortedLanguagesByUse"
              placeholder="Select a language"
              v-model="file.language"
              :reduce="selectedLanguage => selectedLanguage.name"
              :clearable="false"
            >
              <template v-slot:option="option">
                {{ option.name | capitalize }}
              </template>
            </v-select>
            <b-button
              pill
              v-for="languageTag in sortedLanguagesByUse.slice(0, 3)"
              :style="
                'background-color: ' +
                  stringToColour(languageTag.name) +
                  '; color: #fff;'
              "
              :key="languageTag.name"
              @click="file.language = languageTag.name"
              >{{ languageTag.name }}</b-button
            >
          </b-field>

          <b-field horizontal label="Content">
            <editor
              v-model="file.content"
              :lang="file.language"
              theme="monokai"
              width="100%"
              height="260"
            ></editor>
          </b-field>
        </div>

        <div class="text-center">
          <button
            class="button"
            type="button"
            @click="addFile()"
            v-if="files.length < 5"
          >
            <b-icon id="plus" icon="plus"></b-icon>
            Add a file
          </button>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button
          class="button"
          type="button"
          @click="$modal.hide('create-note-modal')"
        >
          Cancel
        </button>
        <button
          class="button is-primary"
          type="button"
          :disabled="isDisabled"
          @click="createNote()"
        >
          Create
        </button>
      </footer>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import editor from "@/components/editor/Editor";
import languages from "@/assets/data/languages.json";
import converter from "@/converter";
import vSelect from "vue-select";
import ColorHash from "color-hash";

const noteNameCharacters = "abcdef0123456789";
const createModalName = "create-note-modal";

const generateNoteName = () => {
  let text = "";
  for (let i = 0; i < 32; i += 1) {
    text += noteNameCharacters.charAt(Math.floor(Math.random() * 16));
  }
  return text;
};

export default {
  name: "cn-create-note-modal",
  components: { editor, vSelect },
  data() {
    return {
      note: {
        name: "",
        description: "",
        files: {},
        public: false,
        updatedAt: null,
        createdAt: null,
        tags: []
      },
      files: [
        {
          name: "",
          language: "text",
          content: ""
        }
      ],
      languages,
      displayDupError: false
    };
  },
  mounted() {
    if (this.gistsSelected) {
      this.$refs.noteDescription.focus();
    } else {
      this.$refs.noteName.focus();
    }
  },
  methods: {
    ...mapActions(["addNote"]),
    createNote() {
      if (!this.containsDupFiles()) {
        const noteType = this.getNoteType();

        this.files.forEach((file, i) => {
          const filename = file.name || `${noteType}file${i + 1}`;
          const key = converter.filenameToKey(
            filename,
            file.language,
            noteType
          );
          this.note.files[key] = file;
        });
        this.note.createdAt = new Date();
        this.note.updatedAt = new Date();

        if (!this.note.name || this.note.name.trim() === "") {
          this.note.name = `${noteType}:${generateNoteName()}`;
        }

        this.addNote(this.note).then(() => {
          this.$modal.hide(createModalName);
        });
      } else {
        this.displayDupError = true;
      }
    },
    addFile() {
      this.files.push({
        name: "",
        language: "text",
        content: ""
      });
    },
    deleteFile(file) {
      this.files = this.files.filter(f => f !== file);
    },
    containsDupFiles() {
      const map = new Map();
      let dupFiles = false;

      this.files.forEach(file => {
        const key = converter.filenameToKey(
          file.name,
          file.language,
          this.getNoteType()
        );

        if (map.has(key)) {
          dupFiles = true;
        }

        map.set(key, 1);
      });

      return dupFiles;
    },
    getNoteType() {
      return this.gistsSelected ? "gist" : "note";
    },
    stringToColour(str) {
      const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.6 });
      return colorHash.hex(str);
    }
  },
  computed: {
    ...mapGetters(["gistsSelected", "notes"]),
    isDisabled() {
      const isGistDisabled = () =>
        !/\S/.test(this.note.description) ||
        this.files.some(file => !/\S/.test(file.name)) ||
        this.files.some(file => !/\S/.test(file.language)) ||
        this.files.some(file => !/\S/.test(file.content));

      const isNoteDisabled = () =>
        isGistDisabled() || !/\S/.test(this.note.name);

      return this.gistsSelected ? isGistDisabled() : isNoteDisabled();
    },
    sortedLanguagesByUse() {
      this.languages.forEach(language => {
        language.frequency = 0;
      });
      this.notes.forEach(note => {
        Object.keys(note.files).forEach(file => {
          const languageUsed = this.languages.find(
            language => note.files[file].language === language.name
          );
          languageUsed.frequency = languageUsed.frequency
            ? (languageUsed.frequency += 1)
            : (languageUsed.frequency = 1);
        });
      });
      return this.languages.slice().sort((a, b) => {
        if (a.frequency > b.frequency) {
          return -1;
        }
        if (a.frequency < b.frequency) {
          return 1;
        }
        return 0;
      });
    }
  }
};
</script>

<style src="./CreateNoteModal.scss" lang="scss"></style>
<style src="vue-select/dist/vue-select.css"></style>
