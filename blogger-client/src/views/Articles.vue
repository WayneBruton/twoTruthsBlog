<template>
  <div class="about">
    <br />
    <v-btn color="#111d5e" text icon @click="back" v-show="!disabled">
      <v-icon color="#111d5e" x-large>mdi-chevron-left</v-icon>
      <strong>Back</strong>
    </v-btn>
    <!-- <Advert /> -->

    <v-container>
      <v-col :cols="flex" :offset="offset">
        <v-row dense>
          <v-card :id="cards.id" elevation="1" min-width="100%">
            <cld-image
              :cloudName="cloudName"
              :publicId="cards.coverImgID"
              class="white--text align-end"
              loading="lazy"
            >
              <cld-transformation crop="fit" />
              <cld-transformation gravity="center" />

              <cld-transformation quality="auto" fetchFormat="auto" />
            </cld-image>
            <v-card-text
              ><strong>{{ cards.credit }}</strong></v-card-text
            >

            <div class="title" style="display: flex; justify-content: center;">
              <v-card-title
                class="title"
                v-text="cards.title"
                style="font-size: 150%;"
              ></v-card-title>
            </div>

            <v-card-text
              ><strong>By:</strong> {{ cards.member_name }}</v-card-text
            >
            <v-card-text
              v-html="cards.content"
              style="color:black; align:left;"
            ></v-card-text>

            <v-card-text
              ><strong>Words:</strong>{{ cards.wordCount }}</v-card-text
            >
            <v-card-text
              ><strong>Time to Read:</strong> {{ cards.readTime }}</v-card-text
            >
            <v-card-text><strong>Likes:</strong> {{ cards.claps }}</v-card-text>
            <v-card-text v-if="showClaps"
              ><strong>Likes by you:</strong> {{ showClaps }}</v-card-text
            >
            <v-btn icon text :to="{ name: 'contact' }"
              ><v-icon color="#111d5e">mdi-emoticon-frown</v-icon></v-btn
            >

            <v-card-actions>
              <div style="display: flex;" v-show="!disabled">
                <div
                  style="display: flex;"
                  v-if="
                    !votedBefore && cards.member !== this.$store.state.userId
                  "
                >
                  <v-btn
                    :disabled="thumbsUpDisabled"
                    icon
                    @click="addClaps"
                    @mouseleave="addLikesDone"
                  >
                    <v-icon large color="#111d5e">mdi-thumb-up-outline</v-icon>
                  </v-btn>
                  <v-btn
                    :disabled="thumbsDownDisabled"
                    icon
                    @click="deductClaps"
                    @mouseleave="addLikesDone"
                  >
                    <v-icon large color="#111d5e"
                      >mdi-thumb-down-outline</v-icon
                    >
                  </v-btn>
                </div>
              </div>
              <div v-show="!disabled">
                <v-btn
                  icon
                  @click="bookmark"
                  v-if="cards.member !== this.$store.state.userId"
                >
                  <v-icon large :color="bookmarkColor" v-model="bookMarked"
                    >mdi-bookmark</v-icon
                  >
                </v-btn>
              </div>
              <v-spacer></v-spacer>
              <SocialMedia :url="url" :title="title" :tag="tag" />
            </v-card-actions>

            <hr />
            <br />
            <br />
            <Comments
              v-show="!disabled"
              :currentArticle="currentArticle"
              :authorId="authorId"
            />
            <br />
            <br v-show="!disabled" />
            <hr v-show="!disabled" />

            <v-col :cols="flex" :offset="offset">
              <div class="author">
                <cld-image
                  v-if="this.cards.avatar"
                  :cloudName="cloudName"
                  :publicId="publicID"
                >
                  <cld-transformation
                    crop="fill"
                    gravity="face"
                    border="2px_solid_transparent"
                    radius="max"
                    width="200"
                    height="200"
                    quality="auto"
                    loading="lazy"
                  />
                </cld-image>
                <div class="authorDetails">
                  <p @click="viewProfile">
                    Name: {{ this.cards.member_name }}
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          v-show="!disabled"
                          v-on="on"
                          icon
                          @click="viewProfile()"
                        >
                          <v-icon color="#111d5e">mdi-account-box</v-icon>
                        </v-btn>
                      </template>
                      <span>View</span>
                    </v-tooltip>
                  </p>
                  <p v-show="!disabled" v-if="this.cards.showEmail">
                    email:
                    <a :href="this.cards.email">Send Email</a>
                  </p>
                  <p v-show="!disabled" v-if="this.cards.website">
                    website:
                    <a :href="this.cards.website" target="_blank">
                      Website
                    </a>
                  </p>
                  <v-btn
                    v-show="!disabled"
                    width="160"
                    outlined
                    text
                    :color="followingColor"
                    @click="follow"
                    v-if="cards.member !== this.$store.state.userId"
                  >
                    <v-icon :color="followingIcon">{{ followingIcon }}</v-icon>
                    <v-spacer></v-spacer>
                    {{ followingText }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-card>
          <br /><br />
        </v-row>
      </v-col>

      <v-layout style="" v-if="recentArticles.length" class="holding">
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
              <v-toolbar-title>Recent Articles by Same Author</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list multiple subheader>
              <v-list-item
                v-for="item in recentArticles"
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

    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "articles",
  metaInfo() {
    return {
      title: `${this.title}`,
      titleTemplate: "Vellum - %s",
      meta: [
        {
          name: "description",
          content:
            "Follow this author " +
            this.cards.member +
            " on Vellum - " +
            this.cards.member_name
        },
        { property: "og:site_name", content: "Vellum" },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: "https://velum.co.za/articles?id=@" + this.cards.id
        }
      ],
      htmlAttrs: {
        lang: "en",
        amp: true
      }
    };
  },
  data: () => ({
    tokenValid: true,
    currentArticle: null,
    authorId: null,
    recentArticles: [],
    currentCommentID: null,
    dialog: false,
    cards: [],
    windowWidth: null,
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    publicID: "",
    flex: 0,
    offset: 0,
    width: 30,
    height: 30,
    claps: 0,
    nowClapps: 0,
    showClaps: "",
    thumbsUpDisabled: false,
    thumbsDownDisabled: true,
    votedBefore: false,
    votedMembers: [],
    bookMarked: false,
    bookmarkColor: "grey",
    following: false,
    followingColor: "grey",
    followingIcon: "mdi-motion-sensor",
    followingText: "follow",
    snackbar: false,
    snackBarMessage: "",
    disabled: false,
    timeOut: 3000,
    url: "",
    tag: "",
    title: ""
  }),
  components: {
    SocialMedia: () => import("../components/articles/SocialMedia"),
    Comments: () => import("../components/articles/Comments")
    // Advert: () => import("../components/Advert"),
  },
  async beforeMount() {
    window.scrollTo(0, 0);
  },
  watch: {
    windowWidth: function() {
      this.resizePage();
    }
  },
  async mounted() {
    window.scrollTo(0, 0);
    if (!this.$store.state.isLoggedOn) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.windowWidth = window.innerWidth;
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
    let search = window.location.search;
    this.src = this.$router.path;
    let query = search.replace("?", "").split("=");
    let credentials = query[query.length - 1];
    this.currentArticle = credentials;
    this.articleId = credentials;
    let response = await DirectoryService.getArticle(credentials);

    if (response.data.success === false) {
      this.tokenValid = false;
      this.$store.dispatch("logout");
      this.$store.dispatch("viewArticleIdBeforeLoggedIn", this.$route.query.id);
      this.$router.push({ name: "login" });
    } else {
      this.tokenValid = true;
      let fullPath = this.$route.fullPath.substring(1);
      this.tag = JSON.parse(response.data[0][0].tags)[0];
      this.url = `${process.env.VUE_APP_BASEURL}${fullPath}`;
      this.$store.dispatch("clearArticleIdBeforeLoggedIn");
      this.cards = response.data[0][0];
      this.authorId = response.data[0][0].member;
      this.title = this.cards.title;
      let recentCredentials = {
        articleId: this.currentArticle,
        authorId: this.authorId
      };
      let recentArticlesResponse = await DirectoryService.recentArticles(
        recentCredentials
      );
      this.recentArticles = recentArticlesResponse.data;
      this.cards.title = this.cards.title.toUpperCase();
      this.publicID = this.cards.avatar;
      this.votedMembers = [];
      response.data[1].forEach(el => {
        this.votedMembers.push(el.member);
      });
      let thisMember = this.votedMembers.filter(el => {
        return el === this.$store.state.userId;
      });
      this.votedBefore = [];
      if (thisMember.length) {
        this.votedBefore = true;
      } else {
        this.votedBefore = false;
      }
      this.followingAndBookmarked();
    }
  },
  methods: {
    viewProfile() {
      this.$router.push({ name: "profileview", query: { id: this.authorId } });
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
        this.height = 40;
        this.width = 40;
      } else {
        this.flex = 10;
        this.offset = 1;
        this.height = 60;
        this.width = 60;
      }
    },
    articleClick() {},
    async followingAndBookmarked() {
      let followingAndBookmarked = {
        member: this.$store.state.userId,
        member_following: this.cards.member,
        article: this.cards.id
      };
      try {
        let followingResponse = await DirectoryService.followingAndBookmarked(
          followingAndBookmarked
        );
        if (!followingResponse.data[0].length) {
          this.bookMarked = false;
          this.bookmarkColor = "grey";
        } else {
          this.bookMarked = true;
          this.bookmarkColor = "#111d5e";
        }
        if (!followingResponse.data[1].length) {
          this.following = false;
          this.followingColor = "grey";
          this.followingIcon = "mdi-motion-sensor";
          this.followingText = "follow";
        } else {
          this.following = true;
          this.followingColor = "#111d5e";
          this.followingIcon = "mdi-motion-sensor-off";
          this.followingText = "following";
        }
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    addClaps() {
      this.nowClapps = this.claps;
      this.claps++;
      this.cards.claps++;
      this.showClapsandButtons();
    },
    deductClaps() {
      this.nowClapps = this.claps;
      this.claps--;
      this.cards.claps--;
      this.showClapsandButtons();
    },
    showClapsandButtons() {
      if (this.claps === 1) {
        this.showClaps = `${this.claps} like`;
        this.thumbsDownDisabled = false;
        this.thumbsUpDisabled = false;
      } else if (this.claps === 5) {
        this.showClaps = `${this.claps} likes`;
        this.thumbsDownDisabled = false;
        this.thumbsUpDisabled = true;
      } else if (this.claps === 0) {
        this.showClaps = ``;
        this.thumbsDownDisabled = true;
        this.thumbsUpDisabled = false;
      } else {
        this.showClaps = `${this.claps} likes`;
        this.thumbsDownDisabled = false;
        this.thumbsUpDisabled = false;
      }
    },
    async addLikesDone() {
      if (this.nowClapps !== this.claps) {
        let credentials = {
          articleID: this.cards.id,
          userID: this.$store.state.userId,
          claps: this.claps
        };
        try {
          await DirectoryService.addLikes(credentials);
          this.nowClapps = this.claps;
        } catch (e) {
          this.snackBarMessage = "Error getting articles";
          this.snack = true;
        }
      }
    },
    async bookmark() {
      let toBookMark;
      if (!this.bookMarked) {
        this.bookMarked = true;
        this.bookmarkColor = "#111d5e";
        toBookMark = true;
      } else {
        this.bookMarked = false;
        this.bookmarkColor = "grey";
        toBookMark = false;
      }
      let bookMark = {
        member: this.$store.state.userId,
        article: this.cards.id,
        toBookMark: toBookMark
      };
      try {
        await DirectoryService.bookMark(bookMark);
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    async follow() {
      let toFollow;
      if (!this.following) {
        this.following = true;
        this.followingColor = "#111d5e";
        this.followingIcon = "mdi-motion-sensor-off";
        this.followingText = "following";
        toFollow = true;
      } else {
        this.following = false;
        this.followingColor = "grey";
        this.followingIcon = "mdi-motion-sensor";
        this.followingText = "follow";
        toFollow = false;
      }
      let follow = {
        member: this.$store.state.userId,
        member_following: this.cards.member,
        toFollow: toFollow
      };
      try {
        await DirectoryService.follow(follow);
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    },
    async articleNavigate(event) {
      try {
        if (this.$store.state.isLoggedOn) {
          this.$router.push({ name: "articles", query: { id: targetID } });
          let targetID = event.currentTarget.id;
          let credentials = targetID;
          this.currentArticle = targetID;
          this.articleId = targetID;
          let response = await DirectoryService.getArticle(credentials);
          this.tokenValid = true;
          this.cards = response.data[0][0];
          this.authorId = response.data[0][0].member;
          let recentCredentials = {
            articleId: this.currentArticle,
            authorId: this.authorId
          };
          let recentArticlesResponse = await DirectoryService.recentArticles(
            recentCredentials
          );
          this.recentArticles = recentArticlesResponse.data;
          this.cards.title = this.cards.title.toUpperCase();
          this.publicID = this.cards.avatar;
          this.votedMembers = [];
          response.data[1].forEach(el => {
            this.votedMembers.push(el.member);
          });
          let thisMember = this.votedMembers.filter(el => {
            return el === this.$store.state.userId;
          });
          this.votedBefore = [];
          if (thisMember.length) {
            this.votedBefore = true;
          } else {
            this.votedBefore = false;
          }
          this.followingAndBookmarked();
          this.$router.push({ name: "articles", query: { id: targetID } });
          window.scrollTo(0, 0);
        }
      } catch (e) {
        this.snackBarMessage = "Error getting recent articles";
        this.snack = true;
      }
    }
  },
  async beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    if (this.tokenValid) {
      let credentials = {
        articleID: this.cards.id
      };
      try {
        await DirectoryService.updateArticleLikes(credentials);
      } catch (e) {
        this.snackBarMessage = "Error getting articles";
        this.snack = true;
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 200%;
  font-weight: 200%;
}
.centered-input >>> input {
  text-align: center;
}
div >>> .ql-indent-1 {
  text-indent: 8%;
}
div >>> .ql-indent-2 {
  text-indent: 16%;
}
div >>> .ql-indent-3 {
  text-indent: 24%;
}
div >>> .ql-indent-4 {
  text-indent: 32%;
}
div >>> .ql-indent-5 {
  text-indent: 40%;
}
div >>> .ql-indent-6 {
  text-indent: 48%;
}
div >>> .ql-indent-7 {
  text-indent: 56%;
}
div >>> .ql-indent-8 {
  text-indent: 64%;
}

div >>> .ql-align-center {
  text-align: center;
}
div >>> .ql-align-right {
  text-align: right;
}
div >>> .ql-align-justify {
  text-align: justify;
}
div >>> .ql-syntax {
  color: white;
  background-color: black;
  margin: 5px 5px;
  padding: 5px 5px;
  border: 1px solid black;
  border-radius: 7px;
}
div >>> img {
  width: 60%;
}
div >>> p,
div >>> h1,
div >>> h2,
div >>> h3,
div >>> h4,
div >>> h5,
div >>> h6,
div >>> li,
div >>> ul,
div >>> ol,
/* div >>> blockquote, */
div >>> pre {
  text-align: left;
}
div >>> blockquote {
  text-align: center;
}

.preview {
  background-color: lightgrey;
  border: 1px solid lightgrey;
  border-radius: 7px;
}
.coverImg {
  size: 120%;
  align-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  left: 0px;
}

div >>> img {
  width: 80%;
  align-content: center;
}
div >>> p {
  font-size: 115%;
}
div >>> pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
  text-align: justify;
}
div >>> ol {
  list-style-type: decimal;
  font-size: 115%;
}
div >>> ul {
  list-style-type: square;
  font-size: 115%;
}
.author {
  display: flex;
  align-items: center;
  width: 100%;
}
.authorDetails {
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  margin: 10px 125px;
}
.holding {
  display: flex;
}
@media only screen and (max-width: 768px) {
  .author {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .authorDetails {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    margin: 10px 125px;
  }
  .v-list-item {
    font-size: 80%;
  }
  .v-list-item {
    background: white;
  }
}
</style>
