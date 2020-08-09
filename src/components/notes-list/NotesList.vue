<template>
  <div id="notes-list">
    <div id="search-buttons" class="columns">
      <div id="search">
        <b-field>
          <b-input
            placeholder="Search by name, description or language..."
            v-model="searchField"
            type="search"
            icon="search"
          ></b-input>
        </b-field>
      </div>
      <div id="buttons">
        <button
          id="preferences"
          class="button is-light"
          @click="settingsModalActive = true"
        >
          <b-icon icon="gear"></b-icon>
        </button>
        <button
          id="add-note"
          class="button is-dark"
          @click="showCreateNoteModal()"
        >
          <b-icon icon="plus"></b-icon>
        </button>
      </div>
    </div>

    <div class="loading-bro" v-if="isLoading">
      <h1>Loading</h1>
      <svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
        <circle id="loading-inner" cx="75" cy="75" r="60" />
      </svg>
    </div>

    <template v-if="notesFiltered.length > 0 && !isLoading">
      <div
        class="columns notes"
        v-for="(note, index) in notesFiltered"
        :key="index"
      >
        <div class="column is-12 note-card">
          <cn-note-card :note="note"></cn-note-card>
        </div>
      </div>
    </template>
    <div
      v-if="notesFiltered.length === 0 && searchField === '' && !isLoading"
      class="columns notes"
    >
      <div
        class="column is-12 no-note"
        v-if="
          !gistsSelected ||
            (gistsSelected && settings.githubPersonalAccessToken)
        "
      >
        <h1>Hey !</h1>
        <h2>You don't have any {{ gistsSelected ? "gist" : "note" }}...</h2>
        <button class="button is-primary" @click="createNoteModalActive = true">
          Create a new one :)
        </button>
      </div>
      <div v-if="!settings.githubPersonalAccessToken && gistsSelected">
        <div class="column is-8 is-offset-2 no-token">
          <h1>Hey !</h1>
          <h2>
            If you want to manage your gists,
            <a @click="helpTokenModalActive = true"
              >get a personal access token</a
            >
            on Github and paste it into the
            <a @click="settingsModalActive = true">settings</a>.
          </h2>
        </div>
      </div>
    </div>
    <div
      v-if="notesFiltered.length === 0 && searchField !== '' && !isLoading"
      class="columns notes"
    >
      <div class="column is-12 no-note">
        <h1>Oh :(</h1>
        <h2>
          Sorry, no {{ gistsSelected ? "gist" : "note" }} found for your search
        </h2>
      </div>
    </div>

    <modal
      :name="'create-note-modal'"
      :resizable="true"
      :reset="true"
      :adaptive="true"
      height="70%"
      width="700"
      :min-width="700"
      :min-height="550"
    >
      <cn-create-note-modal></cn-create-note-modal>
    </modal>

    <b-modal :active.sync="settingsModalActive" has-modal-card>
      <cn-settings-modal></cn-settings-modal>
    </b-modal>

    <b-modal :active.sync="helpTokenModalActive" has-modal-card>
      <cn-help-token-modal></cn-help-token-modal>
    </b-modal>

    <b-modal :active.sync="aboutModalActive" has-modal-card>
      <cn-about-modal></cn-about-modal>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NoteCard from "./note-card/NoteCard";
import CreateNoteModal from "../modals/create-note-modal/CreateNoteModal";
import SettingsModal from "../modals/settings-modal/SettingsModal";
import HelpTokenModal from "../modals/help-token-modal/HelpTokenModal";
import AboutModal from "../modals/about-modal/AboutModal";

const createNoteModalName = "create-note-modal";

export default {
  name: "cn-notes-list",
  components: {
    "cn-note-card": NoteCard,
    "cn-create-note-modal": CreateNoteModal,
    "cn-help-token-modal": HelpTokenModal,
    "cn-settings-modal": SettingsModal,
    "cn-about-modal": AboutModal
  },
  data() {
    return {
      searchField: "",
      createNoteModalActive: false,
      settingsModalActive: false,
      helpTokenModalActive: false,
      aboutModalActive: false
    };
  },
  methods: {
    ...mapActions(["loadNotes", "loadSettings"]),
    showCreateNoteModal() {
      this.$modal.show(createNoteModalName);
    }
  },
  computed: {
    ...mapGetters([
      "notes",
      "noteById",
      "languageSelected",
      "gistsSelected",
      "isLoading",
      "settings"
    ]),
    notesFiltered() {
      const notesFiltered = this.notes.filter(item =>
        this.searchField
          .split(" ")
          .every(
            el =>
              item.name.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              item.description.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
              (item.tags
                ? item.tags.some(
                    tag => tag.toLowerCase().indexOf(el.toLowerCase()) > -1
                  )
                : false) ||
              Object.keys(item.files).some(
                key =>
                  key.toLowerCase().indexOf(el.toLowerCase()) > -1 ||
                  item.files[key].language
                    .toLowerCase()
                    .indexOf(el.toLowerCase()) > -1
              )
          )
      );

      if (this.languageSelected !== "all") {
        const notesFilteredByLanguage = [];

        notesFiltered.forEach(note => {
          if (
            Object.keys(note.files).some(
              key => note.files[key].language === this.languageSelected
            )
          ) {
            notesFilteredByLanguage.push(note);
          }
        });

        return notesFilteredByLanguage;
      }

      return notesFiltered;
    }
  },
  beforeRouteEnter(route, redirect, next) {
    next(vm => {
      vm.loadNotes();
      vm.loadSettings();
    });
  }
};
</script>

<style src="./NotesList.scss" lang="scss"></style>
