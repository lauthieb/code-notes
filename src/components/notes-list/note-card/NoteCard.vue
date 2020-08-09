<template>
  <div class="box" xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <article class="media">
      <div class="media-content">
        <div class="content">
          <div id="card-header" class="columns">
            <div id="name-category" class="column is-9">
              <h4 v-if="gistsSelected">
                {{ note.description }}
                <b-icon class="visibility-icon" :icon="note.public ? 'globe' : 'lock'"></b-icon>
              </h4>
              <h3 v-else>{{ note.name }}</h3>
            </div>
            <div id="action-buttons" class="column is-3">
              <div class="is-pulled-right">
                <a
                  id="link-note"
                  v-if="gistsSelected"
                  @click="open(note.url)"
                  title="Show on Github"
                >
                  <b-icon icon="github"></b-icon>
                </a>
                <a
                  id="convert-note"
                  v-if="!gistsSelected && githubToken"
                  @click="convertNoteToGist"
                  title="Convert to gist"
                >
                  <b-icon icon="share" size="is-small"></b-icon>
                  <b-icon icon="github"></b-icon>
                </a>
                <a id="update-note" @click="showUpdateNoteModal(note.name)" title="Edit note">
                  <b-icon icon="pencil"></b-icon>
                </a>
                <a id="delete-note" @click="deleteNoteModal()" title="Delete note">
                  <b-icon icon="trash"></b-icon>
                </a>
              </div>
            </div>
          </div>
          <p v-if="!gistsSelected">{{ note.description }}</p>

          <b-tag
            type="is-dark"
            v-for="tag in note.tags"
            :data="tag"
            :style="'background-color: ' + stringToColour(tag) + ';'"
            :key="tag.text"
          >{{ tag }}</b-tag>

          <div class="note-file" v-for="(value, key, index) in note.files" :key="index">
            <h4>
              {{ value.name }}
              <span class="note-file-small">
                ({{ value.language }})
                <a
                  id="copy-file"
                  v-clipboard:copy="value.content"
                  v-clipboard:success="onCopyClipboardSuccess"
                  title="Copy to clipboard"
                >
                  <b-icon icon="clipboard"></b-icon>
                </a>
                <a
                  id="export-carbon"
                  @click="exportToCarbon(value.content)"
                  title="Export to Carbon"
                >
                  <b-icon icon="image"></b-icon>
                </a>
              </span>
            </h4>
            <editor
              :code="value.content"
              :lang="value.language"
              theme="monokai"
              width="100%"
              height="260"
              :readOnly="true"
            ></editor>
          </div>
        </div>
      </div>
    </article>

    <modal
      :name="note.name"
      :resizable="true"
      :reset="true"
      :adaptive="true"
      height="70%"
      width="700"
      :min-width="700"
      :min-height="550"
    >
      <cn-update-note-modal :note="note"></cn-update-note-modal>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ColorHash from "color-hash";
import editor from "@/components/editor/Editor";
import UpdateNoteModal from "@/components/modals/update-note-modal/UpdateNoteModal";

export default {
  name: "cn-note-card",
  components: {
    "cn-update-note-modal": UpdateNoteModal,
    editor
  },
  props: {
    note: Object
  },
  mounted() {},
  data() {
    return {
      updateNoteModalActive: false
    };
  },
  computed: {
    ...mapGetters(["notes", "gistsSelected", "githubToken"])
  },
  methods: {
    ...mapActions(["updateNote", "deleteNote", "convertToGist", "selectGists"]),
    stringToColour(str) {
      const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.6 });
      return colorHash.hex(str);
    },
    showUpdateNoteModal(name) {
      this.$modal.show(name);
    },
    updateNoteModal() {
      this.updateNote(this.note);
    },
    deleteNoteModal() {
      this.$buefy.dialog.confirm({
        title: this.gistsSelected ? "Delete gist" : "Delete note",
        message: `Are you sure you want to delete this ${
          this.gistsSelected ? "gist" : "note"
        } ?`,
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.deleteNote(this.note);
        }
      });
    },
    convertNoteToGist() {
      this.convertToGist(this.note)
        .then(() => {
          this.$buefy.dialog.confirm({
            title: "Successful",
            message:
              "Note was converted to gist.<br>Do you want to delete local note ?",
            confirmText: "Delete",
            cancelText: "Keep",
            type: "is-success",
            icon: "check-circle",
            hasIcon: true,
            onConfirm: () => {
              this.deleteNote(this.note);
              this.selectGists(true);
            },
            onCancel: () => {
              this.selectGists(true);
            }
          });
        })
        .catch(() => {
          this.$buefy.dialog.alert({
            title: "Error",
            message: "Note was not converted to gist.<br>Please retry later.",
            type: "is-danger",
            hasIcon: true,
            icon: "times-circle"
          });
        });
    },
    onCopyClipboardSuccess() {
      this.$toast.open({
        message: "Copied",
        position: "is-bottom"
      });
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    exportToCarbon(content) {
      const url =
        "https://carbon.now.sh/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=43px&ph=57px&ln=false&code=";
      this.$electron.shell.openExternal(`${url}${encodeURI(content)}`);
    }
  }
};
</script>

<style src="./NoteCard.scss" lang="scss" scoped></style>
