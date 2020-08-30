<template>
  <div class="about">
    <br />
    <br />
    <v-btn color="#111d5e" text icon @click="back">
      <v-icon color="#111d5e" x-large>mdi-chevron-left</v-icon>
      <strong>Back</strong>
    </v-btn>
    <v-container fluid v-if="this.$store.state.isLoggedOn">
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <h1>{{ name }}</h1>
        </v-col>
        <v-col
          v-if="this.$store.state.avatar && src !== 0"
          :cols="flex"
          :offset="offset"
          center
        >
          <cld-image :cloudName="cloudName" :publicId="src">
            <cld-transformation
              crop="fill"
              border="2px_solid_transparent"
              gravity="face"
              radius="max"
              width="150"
              height="150"
              quality="auto"
              loading="lazy"
            />
          </cld-image>
        </v-col>
        <br />

        <v-col :cols="flex" :offset="offset" v-if="this.showEmail === 1">
          <label justify-left>{{ email }}</label>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left>{{ website }}</label>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <v-textarea
            style="margin: 15px 15px; padding: 5px 10px;"
            placeholder="Tell us about yourself"
            v-model="aboutMember"
            rounded
            solo
            readonly
          >
          </v-textarea>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left
            >Followers: {{ followers }}
            {{ followers === 1 ? "follower" : "followers" }}</label
          >
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left
            >Following: {{ following }}
            {{ following === 1 ? "member" : "members" }}
          </label>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <label justify-left
            >Articles: {{ authorArticles.length }}
            {{ authorArticles.length === 1 ? "article" : "articles" }}
          </label>
        </v-col>
        <br /><br />
      </v-row>

      <v-layout style="" v-if="authorArticles.length" class="holding">
        <br /><br />
        <v-col :cols="flex" :offset="offset">
          <v-card
            max-width="1000"
            min-width="100%"
            class="mx-auto"
            elevation="1"
          >
            <v-toolbar color="#111d5e" dark elevation="0">
              <v-spacer></v-spacer>
              <v-toolbar-title>Articles by {{ name }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list multiple subheader>
              <v-list-item
                v-for="item in authorArticles"
                :key="item.id"
                :id="item.id"
                @click="articleNavigate($event)"
                style="display: flex;"
              >
                <v-list-item-content
                  style="display: flex; flex-direction: column; width: 70%;"
                >
                  <v-list-item-title
                    v-text="item.title"
                    style="font-size: 100%; width: 60%;"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    >{{ item.readTime }} read</v-list-item-subtitle
                  >
                </v-list-item-content>
                <v-list-item-action style="width: 10%;">
                  <cld-image
                    :cloudName="cloudName"
                    :publicId="item.coverImgID"
                    loading="lazy"
                    :width="width"
                    :height="height"
                  >
                    <cld-transformation crop="fill" quality="auto" angle="0" />
                  </cld-image>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "profileview",
  metaInfo() {
    return {
      title: `${this.name}`,
      titleTemplate: "Vellum - %s",
      meta: [
        {
          name: "description",
          content: "Follow this author " + this.name + " on Vellum - "
        },
        { property: "og:site_name", content: "Vellum" },
        { property: "og:type", content: "profile" }
      ],
      htmlAttrs: {
        lang: "en",
        amp: true
      }
    };
  },
  components: {},
  data() {
    return {
      flex: 6,
      offset: 2,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      preset: `${process.env.VUE_APP_PRESET}`,
      src: "",
      name: "",
      email: "",
      website: "",
      showEmail: null,
      aboutMember: "",
      followers: 999,
      following: 999,
      windowWidth: null,
      authorArticles: []
    };
  },
  async mounted() {
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
    if (this.windowWidth < 768) {
      this.flex = 12;
      this.offset = 0;
    } else {
      this.flex = 6;
      this.offset = 3;
    }
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
      if (this.windowWidth < 768) {
        this.width = 40;
        this.height = 40;
      } else {
        this.width = 60;
        this.height = 60;
      }
    }, 0);
    try {
      let search = window.location.search;
      let query = search.replace("?", "").split("=");
      let credentials = { id: query[query.length - 1] };
      let response = await DirectoryService.viewProfile(credentials);
      this.email = response.data[0][0].email;
      this.name = response.data[0][0].name;
      this.website = response.data[0][0].website;
      this.src = response.data[0][0].avatar;
      this.showEmail = response.data[0][0].showEmail;
      this.aboutMember = response.data[0][0].aboutMember;
      this.followers = response.data[1][0].followers;
      this.following = response.data[2][0].following;
      let recentCredentials = {
        authorId: query[query.length - 1]
      };
      let authorArticlesResponse = await DirectoryService.authorArticles(
        recentCredentials
      );
      this.authorArticles = authorArticlesResponse.data;
    } catch (e) {
      this.snackBarMessage = "Error getting Author Profile";
      this.snack = true;
    }
  },
  computed: {},
  watch: {
    windowWidth: function() {
      this.resizePage();
    }
  },
  methods: {
    articleNavigate(event) {
      let targetID = event.currentTarget.id;
      this.$router.push({ name: "articles", query: { id: targetID } });
    },
    back() {
      this.$router.back();
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
        this.width = 40;
        this.height = 40;
      } else {
        this.flex = 6;
        this.offset = 3;
        this.width = 60;
        this.height = 60;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped>
.holding {
  display: flex;
}
</style>
