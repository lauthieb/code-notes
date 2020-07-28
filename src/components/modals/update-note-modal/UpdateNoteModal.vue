<template>
  <form action="" class="update-modal modal-form">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Update {{ gistsSelected ? "gist" : "note" }}
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
            v-model="noteUpdated.name"
            placeholder="Your note name"
            required
          >
          </b-input>
        </b-field>

        <b-field horizontal label="Description">
          <b-input
            type="text"
            ref="noteDescription"
            v-model="noteUpdated.description"
            placeholder="Your description"
            required
          >
          </b-input>
        </b-field>

        <b-field v-if="!gistsSelected" horizontal label="Tags">
          <b-taginput v-model="note.tags" maxtags="5"> </b-taginput>
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
            <b-select
              placeholder="Select a language"
              v-model="file.language"
              :clearable="false"
            >
              <option
                v-for="(language, index) in languages"
                :key="index"
                :value="language.name"
              >
                {{ language.name | capitalize }}
              </option>
            </b-select>
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
        <button class="button" type="button" @click="$modal.hide(note.name)">
          Cancel
        </button>
        <button
          class="button is-primary"
          type="button"
          :disabled="isDisabled"
          @click="updateNoteModal()"
        >
          Update
        </button>
      </footer>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import editor from "@/components/editor/Editor";
import languages from "@/assets/data/languages.json";
import converter from "@/converter";

export default {
  name: "cn-update-note-modal",
  components: { editor },
  props: {
    note: Object
  },
  data() {
    return {
      noteUpdated: {
        name: "",
        description: "",
        files: {},
        updatedAt: null,
        createdAt: null,
        tags: []
      },
      files: [],
      gistFiles: [],
      languages,
      displayDupError: false
    };
  },
  mounted() {
    if (this.gistsSelected) {
      this.$refs.noteDescription.focus();
    } else {
      this.$refs.noteName.focus();
      this.note.tags = this.note.tags ? this.note.tags : [];
    }

    this.noteUpdated = { ...this.note };
    this.noteUpdated.files = {};
    Object.keys(this.note.files).forEach((key, index) => {
      this.files.push({ ...this.note.files[key], id: index });
      this.gistFiles.push({
        ...this.note.files[key],
        id: index,
        deleted: false
      });
    });
  },
  methods: {
    ...mapActions(["updateNote"]),
    updateNoteModal() {
      if (!this.containsDupFiles()) {
        if (this.gistsSelected) {
          this.files.forEach(file => {
            if (file.added) {
              this.gistFiles.push(file);
            }
          });

          this.gistFiles.forEach((file, index) => {
            const key = converter.filenameToKey(
              file.name,
              file.language,
              this.getNoteType()
            );

            if (file.deleted) {
              this.noteUpdated.files[key] = null;
            } else {
              this.noteUpdated.files[key] = this.files[index];

              const newFile = this.files.filter(f => f.id === file.id)[0];

              if (
                newFile.name !== file.name ||
                newFile.language !== file.language
              ) {
                this.noteUpdated.files[key].filename = `${
                  newFile.name
                }.${converter.languageToExtension(newFile.language)}`;
              }
            }
          });
        } else {
          this.files.forEach(file => {
            const key = converter.filenameToKey(
              file.name,
              file.language,
              this.getNoteType()
            );
            this.noteUpdated.files[key] = file;
          });
          this.noteUpdated.updatedAt = new Date();
        }

        this.updateNote(this.noteUpdated).then(() => {
          this.$modal.hide(this.note.name);
        });
      } else {
        this.displayDupError = true;
      }
    },
    addFile() {
      this.files.push({
        name: "",
        language: "text",
        content: "",
        deleted: false,
        added: true
      });
    },
    deleteFile(file) {
      if (this.gistsSelected) {
        this.gistFiles.forEach((f, index) => {
          if (f.id === file.id) {
            this.gistFiles[index].deleted = true;
          }
        });
      }

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
    }
  },
  computed: {
    ...mapGetters(["gistsSelected"]),
    isDisabled() {
      const isGistDisabled = () =>
        !/\S/.test(this.noteUpdated.description) ||
        this.files.some(file => !/\S/.test(file.name)) ||
        this.files.some(file => !/\S/.test(file.language)) ||
        this.files.some(file => !/\S/.test(file.content));

      const isNoteDisabled = () =>
        isGistDisabled() || !/\S/.test(this.noteUpdated.name);

      return this.gistsSelected ? isGistDisabled() : isNoteDisabled();
    }
  }
};
</script>

<style src="./UpdateNoteModal.scss" lang="scss"></style>
