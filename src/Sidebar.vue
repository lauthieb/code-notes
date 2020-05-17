<template>
  <aside class="menu">
    <p class="menu-label">
      Notes
    </p>
    <ul class="menu-list">
      <li>
        <a
          :class="{ 'is-active': !gistsSelected }"
          @click="selectGistsSidebar(false)"
          >Local
          <b-icon icon="laptop" class="is-pulled-right"></b-icon>
        </a>
      </li>
      <li>
        <a
          :class="{ 'is-active': gistsSelected }"
          @click="selectGistsSidebar(true)"
          >Gists
          <b-icon icon="github" class="is-pulled-right"></b-icon>
        </a>
      </li>
    </ul>
    <p class="menu-label" v-if="!isLoading">
      Languages
    </p>
    <ul class="menu-list" id="menu-list-languages" v-if="!isLoading">
      <li>
        <a
          :class="{ 'is-active': languageSelected === 'all' }"
          @click="selectLanguageSidebar('all')"
          >All
          <b-tag class="is-pulled-right" type="is-dark">{{ totalFiles }}</b-tag>
        </a>
      </li>
      <li v-for="(list, value) in Array.from(languages)" :key="value">
        <a
          :class="{ 'is-active': languageSelected === list[0] }"
          @click="selectLanguageSidebar(list[0])"
          >{{ list[0] | capitalize }}
          <b-tag class="is-pulled-right" type="is-dark">{{ list[1] }}</b-tag>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "cn-sidebar",
  methods: {
    ...mapActions(["selectLanguage", "selectGists"]),
    selectLanguageSidebar(language) {
      this.selectLanguage(language);
    },
    selectGistsSidebar(gistsSelected) {
      this.selectGists(gistsSelected);
    }
  },
  computed: {
    ...mapGetters([
      "languages",
      "notes",
      "languageSelected",
      "totalFiles",
      "gistsSelected",
      "isLoading"
    ])
  }
};
</script>

<style lang="scss" scoped>
aside {
  position: fixed;
  top: 48px;
  width: 22%;
  margin-top: 24px;

  li {
    margin: 5px 0;

    a {
      padding-bottom: 11px !important;
    }
  }

  #menu-list-languages {
    overflow: scroll;
    max-height: 52vh;
  }

  @media (min-height: 500px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 52vh;
    }
  }

  @media (min-height: 550px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 55vh;
    }
  }

  @media (min-height: 600px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 59vh;
    }
  }

  @media (min-height: 650px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 61vh;
    }
  }

  @media (min-height: 700px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 64vh;
    }
  }

  @media (min-height: 800px) {
    #menu-list-languages {
      overflow: auto;
      max-height: 70vh;
    }
  }
}
</style>
