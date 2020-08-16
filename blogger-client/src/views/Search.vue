<template>
  <div class="about holding">
    <v-container>
      <br />
      <v-col :cols="flex" :offset="offset">
        <h2 v-if="windowWidth < 768">Search</h2>
        <br v-if="windowWidth < 768" />
        <v-card
          max-width="1000"
          min-width="100%"
          class="mx-auto"
          elevation="1"
          style="width: 100%;"
        >
          <v-toolbar color="#111d5e" dark elevation="0">
            <v-toolbar-title v-if="windowWidth > 768">Search</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchTerms"
              prepend-icon="mdi-magnify"
              v-debounce:500ms="myFn"
              placeholder="Search"
            ></v-text-field>
          </v-toolbar>
          <v-list multiple subheader>
            <v-list-item
              v-for="item in cards"
              :key="item.id"
              :id="item.id"
              @click="articleClick($event)"
            >
              <v-list-item-content justify-start>
                <v-list-item-title
                  v-text="item.title"
                  style="font-size: 100%;"
                ></v-list-item-title>
                <v-list-item-subtitle
                  >by: {{ item.author }}</v-list-item-subtitle
                >
                <v-list-item-subtitle
                  >{{ item.readtime }} min read</v-list-item-subtitle
                >
              </v-list-item-content>
              <!-- <v-spacer></v-spacer> -->
              <v-list-item-action>
                <cld-image
                  :cloudName="cloudName"
                  :publicId="item.coverimgID"
                  loading="lazy"
                  :width="width"
                  :height="height"
                >
                  <cld-transformation crop="fill" quality="auto" angle="10" />
                </cld-image>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "search",
  data() {
    return {
      searchTerms: "",
      windowWidth: null,
      flex: 12,
      offset: 0,
      cards: [],
      width: 40,
      height: 40,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      preset: `${process.env.VUE_APP_PRESET}`
    };
  },
  mounted() {
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
    }, 0);
  },
  watch: {
    windowWidth: function() {
      this.resizePage();
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.width = 30;
        this.height = 30;
      } else {
        this.width = 60;
        this.height = 60;
        this.flex = 8;
        this.offset = 2;
      }
    },
    articleClick(event) {
      if (this.$store.state.isLoggedOn) {
        let targetID = event.currentTarget.id;
        this.$router.push({ name: "articles", query: { id: targetID } });
      } else {
        this.snackBarMessage =
          "You have to be registered and logged in to view articles";
        this.snackbar = true;
        setTimeout(() => {
          this.$router.push({ name: "login" });
        }, 2500);
      }
    },
    myFn() {
      this.searchArticles();
    },
    async searchArticles() {
      let credentials = {
        searchTerms: this.searchTerms
      };
      let response = await DirectoryService.searchArticles(credentials);
      this.cards = response.data;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped>
/* .holding {
  display: flex;
  width: 100%;
} */
</style>
