<script>
import { mapGetters, mapActions } from 'vuex';
import ColorHash from 'color-hash';
import editor from '@/components/editor/Editor';
import UpdateNoteModal from '@/components/modals/update-note-modal/UpdateNoteModal';
import BTooltip from '../../../../../node_modules/buefy/src/components/tooltip/Tooltip.vue';

export default {
  template: require('./NoteCard.html'),
  name: 'cn-note-card',
  components: {
    BTooltip,
    'cn-update-note-modal': UpdateNoteModal,
    editor,
  },
  props: {
    note: Object,
  },
  mounted() {},
  data() {
    return {
      updateNoteModalActive: false,
    };
  },
  computed: {
    ...mapGetters(['notes', 'gistsSelected']),
    displayNoteName() {
      return this.note.name.split('-')[0];
    },
  },
  methods: {
    ...mapActions(['updateNote', 'deleteNote']),
    stringToColour(str) {
      const colorHash = new ColorHash({ lightness: 0.5, saturation: 0.6 });
      return colorHash.hex(str);
    },
    updateNoteModal() {
      this.updateNote(this.note);
    },
    deleteNoteModal() {
      this.$dialog.confirm({
        title: this.gistsSelected ? 'Delete gist' : 'Delete note',
        message: `Are you sure you want to delete this ${
          this.gistsSelected ? 'gist' : 'note'
        } ?`,
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteNote(this.note);
        },
      });
    },
    onCopyClipboardSuccess() {
      this.$toast.open({
        message: 'Copied',
        position: 'is-bottom',
      });
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    exportToCarbon(content) {
      const url = 'https://carbon.now.sh/?bg=rgba(0,0,0,0)&t=dracula&l=auto&ds=true&wc=true&wa=true&pv=43px&ph=57px&ln=false&code=';
      this.$electron.shell.openExternal(`${url}${encodeURI(content)}`);
    },
  },
};
</script>

<style src="./NoteCard.scss" lang="scss" scoped></style>
