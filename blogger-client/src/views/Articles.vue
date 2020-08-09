<template>
  <div class="about">
    <v-container>
      <v-col :cols="flex" :offset="offset">
        <v-row dense>
          <v-card :id="cards.id" elevation="1" min-width="100%">
            <!-- height="450" -->
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
            <v-card-actions>
              <div style="display: flex; flex-direction: column;">
                <v-text-field
                  class="centered-input"
                  readonly
                  flat
                  solo
                  text
                  color="clear"
                  style="font-size: 80%;"
                  ease-in
                  v-model="showClaps"
                >
                </v-text-field>
                <div style="display: flex">
                  <div
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
                      <v-icon color="indigo">mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <v-btn
                      :disabled="thumbsDownDisabled"
                      icon
                      @click="deductClaps"
                      @mouseleave="addLikesDone"
                    >
                      <v-icon color="indigo">mdi-thumb-down-outline</v-icon>
                    </v-btn>
                  </div>
                  <v-spacer></v-spacer>

                  <div>
                    <v-spacer></v-spacer>

                    <v-btn
                      icon
                      @click="bookmark"
                      v-if="cards.member !== this.$store.state.userId"
                    >
                      <v-icon :color="bookmarkColor" v-model="bookMarked"
                        >mdi-bookmark</v-icon
                      >
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-actions>
            <hr />
            <br />
            <br />

            <!-- #010a43 -->
            <v-expansion-panels popout color="indigo">
              <v-expansion-panel dark color="indigo">
                <v-expansion-panel-header dark color="indigo" class="header"
                  ><h2 style="color: white;">Comments</h2></v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <br />
                  <h3 style="padding-left: 5px;">Add Comment</h3>
                  <div style="display: flex; align-items: flex-end;">
                    <v-textarea
                      style="margin: 15px 15px; padding: 5px 10px;"
                      placeholder="Add a Comment"
                      v-model="addComment"
                      rounded
                      solo
                      counter="250"
                      maxLength="250"
                      rows="4"
                    ></v-textarea>
                    <v-btn
                      v-if="addComment"
                      :id="this.$store.state.userId"
                      style="margin-bottom: 50px;"
                      icon
                      text
                      @click="addNewComment($event)"
                      ><v-icon color="green">mdi-comment</v-icon>+</v-btn
                    >
                  </div>
                  <v-col :cols="12">
                    <v-toolbar color="rgba(171, 177, 184, 0.2)" elevation="0">
                      <v-spacer></v-spacer>
                      <v-toolbar-title>Comments</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn text icon v-on="on"
                            ><v-icon color="green" @click="displayComments">{{
                              showCommentsIcon
                            }}</v-icon></v-btn
                          >
                        </template>
                        <span>{{ showCommentsTooltip }}</span>
                      </v-tooltip>
                      <v-tooltip top v-if="showComments">
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on" text icon
                            ><v-icon color="green" @click="getComments"
                              >mdi-refresh</v-icon
                            ></v-btn
                          >
                        </template>
                        <span>Refresh</span>
                      </v-tooltip>
                    </v-toolbar>

                    <ul class="commentsUL" v-if="showComments">
                      <span v-if="!comments.length"
                        >No comments yet. Be the first!!</span
                      >
                      <li
                        v-for="item in comments"
                        :key="item.id"
                        :id="item.id"
                        style="margin-top: 5px;"
                      >
                        <v-card
                          max-width="1000"
                          class="mx-auto comment"
                          elevation="0"
                        >
                          <div style="display: flex;">
                            <cld-image
                              v-if="item.avatar"
                              :cloudName="cloudName"
                              :publicId="item.avatar"
                            >
                              <cld-transformation
                                style="margin: 3px 3px;"
                                crop="fill"
                                gravity="face"
                                border="2px_solid_transparent"
                                radius="max"
                                width="40"
                                height="40"
                                quality="auto"
                                loading="lazy"
                              />
                            </cld-image>
                            <v-card-text>
                              <v-textarea
                                style="width: 100%"
                                v-html="item.comment"
                                placeholder="comment"
                                rounded
                                solo
                                readonly
                                rows="1"
                                auto-grow
                              ></v-textarea>
                            </v-card-text>
                            <v-card-actions
                              style="display: flex; justify-content: center; width: 13%;"
                            >
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    style="margin-bottom: 50px;"
                                    text
                                    icon
                                    v-if="
                                      item.commentBy === item.currentUser ||
                                        item.writtenBy === item.currentUser
                                    "
                                    :id="item.id"
                                    @click="deleteComment($event)"
                                    ><v-icon color="red"
                                      >mdi-delete</v-icon
                                    ></v-btn
                                  >
                                </template>
                                <span>Delete</span>
                              </v-tooltip>
                              <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-on="on"
                                    style="margin-bottom: 50px;"
                                    icon
                                    text
                                    :id="item.id"
                                    @click="replyToComment($event)"
                                    ><v-icon color="green"
                                      >mdi-reply</v-icon
                                    ></v-btn
                                  >
                                </template>
                                <span>Reply</span>
                              </v-tooltip>
                            </v-card-actions>
                          </div>
                        </v-card>

                        <!-- replies -->
                        <ul class="commentsUL">
                          <li
                            v-for="reply in item.reply"
                            :key="reply.id"
                            style="margin-top: 5px; margin-left: 15px;"
                          >
                            <v-card
                              max-width="1000"
                              class="mx-auto commentReply"
                              elevation="0"
                            >
                              <div style="display: flex;">
                                <cld-image
                                  style="margin: 3px 3px;"
                                  v-if="reply.avatar"
                                  :cloudName="cloudName"
                                  :publicId="reply.avatar"
                                >
                                  <cld-transformation
                                    crop="fill"
                                    gravity="face"
                                    border="2px_solid_transparent"
                                    radius="max"
                                    width="40"
                                    height="40"
                                    quality="auto"
                                    loading="lazy"
                                  />
                                </cld-image>
                                <v-card-text style="width: 85%">
                                  <v-textarea
                                    placeholder="comment"
                                    v-html="reply.comment"
                                    rounded
                                    solo
                                    readonly
                                    rows="1"
                                    auto-grow
                                  ></v-textarea>
                                </v-card-text>
                                <v-card-actions
                                  style="display: flex; justify-content: center; width: 10%;"
                                >
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        v-on="on"
                                        style="margin-bottom: 50px;"
                                        text
                                        icon
                                        v-if="
                                          reply.commentBy ===
                                            item.currentUser ||
                                            item.writtenBy === item.currentUser
                                        "
                                        :id="reply.id"
                                        @click="deleteReply($event)"
                                        ><v-icon color="red"
                                          >mdi-delete</v-icon
                                        ></v-btn
                                      >
                                    </template>
                                    <span>Delete</span>
                                  </v-tooltip>
                                </v-card-actions>
                              </div>
                            </v-card>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <br />
            <br />
            <hr />

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
                  <p>Name: {{ this.cards.member_name }}</p>
                  <p v-if="this.cards.showEmail">
                    email:
                    <a :href="this.cards.email">Send Email</a>
                  </p>
                  <p v-if="this.cards.website">
                    website:
                    <a :href="this.cards.website" target="_blank">
                      Website
                    </a>
                  </p>
                  <v-btn
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
    </v-container>

    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Reply to Comment</span>
          </v-card-title>
          <v-card-text>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="12"
              offset-md="0"
              offset-sm="0"
            >
              <v-textarea
                ref="reply"
                style="margin: 5px 5px; padding: 5px 10px;"
                placeholder="Post a reply"
                v-model="replyComment"
                solo
                counter="250"
                maxLength="250"
                rows="4"
              ></v-textarea>
            </v-col>
          </v-card-text>
          <v-col cols="12" xs="12" sm="12" md="12">
            <div style="display:flex;justify-content: space-evenly;">
              <v-spacer></v-spacer>
              <v-btn text color="indigo" @click="cancelReply">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :id="currentArticle"
                text
                color="indigo"
                @click="postReply($event)"
                >Add Reply</v-btn
              >
              <v-spacer></v-spacer>
            </div>
          </v-col>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "articles",
  data: () => ({
    tokenValid: true,
    currentArticle: null,
    replyComment: "",
    currentCommentID: null,
    dialog: false,
    showComments: false,
    showCommentsIcon: "mdi-comment-text",
    showCommentsTooltip: "Show",
    cards: [],
    windowWidth: null,
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    publicID: "",
    flex: 0,
    offset: 0,
    claps: 0,
    nowClapps: 0,
    addComment: "",
    comments: [],
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
    timeOut: 3000,
  }),
  components: {},
  async beforeMount() {},
  watch: {
    windowWidth: function() {
      this.resizePage();
    },
  },
  async mounted() {
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
    this.resizePage();
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
      this.$router.push({ name: "about" });
      this.$router.push({ name: "home" });
    } else {
      this.tokenValid = true;
      this.cards = response.data[0][0];
      this.cards.title = this.cards.title.toUpperCase();
      this.publicID = this.cards.avatar;
      this.votedMembers = [];
      response.data[1].forEach((el) => {
        this.votedMembers.push(el.member);
      });
      let thisMember = this.votedMembers.filter((el) => {
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
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
      } else {
        this.flex = 10;
        this.offset = 1;
      }
    },
    async getComments() {
      let search = window.location.search;
      let query = search.replace("?", "").split("=");
      let credentials = query[query.length - 1];
      let comments = {
        id: credentials,
      };
      let commentsResponse = await DirectoryService.getComments(comments);
      commentsResponse.data.forEach((el) => {
        el.currentUser = this.$store.state.userId;
        el.writtenBy = this.cards.member;
      });
      // console.log(commentsResponse.data);

      this.comments = commentsResponse.data;
      this.showComments = true;
    },
    displayComments() {
      if (!this.showComments) {
        this.getComments();
        this.showCommentsIcon = "mdi-window-close";
        this.showComments = true;
        this.showCommentsTooltip = "Hide";
      } else {
        this.showCommentsIcon = "mdi-comment-text";
        this.showComments = false;
        this.comments.length = 0;
        this.showCommentsTooltip = "Show";
      }
    },
    async addNewComment(event) {
      if (this.addComment !== "") {
        let targetID = event.currentTarget.id;
        let credentials = {
          memberName: this.$store.state.userName,
          commentBy: targetID,
          articleNumber: this.currentArticle,
          comment: this.addComment,
        };
        await DirectoryService.addComment(credentials);
        this.addComment = "";
        this.showComments = false;
        this.displayComments();
      } else {
        this.snackBarMessage = "Comment can't be empty";
        this.snackbar = true;
      }
    },
    async deleteComment(event) {
      let targetID = parseInt(event.currentTarget.id);
      let credentials = {
        id: targetID,
      };
      await DirectoryService.deleteComment(credentials);
      this.getComments();
    },
    async deleteReply(event) {
      let targetID = parseInt(event.currentTarget.id);
      let credentials = {
        id: targetID,
      };
      await DirectoryService.deleteReply(credentials);
      this.getComments();
    },
    replyToComment(event) {
      let targetID = parseInt(event.currentTarget.id);
      this.currentCommentID = targetID;
      this.dialog = true;
      setTimeout(() => {
        this.$nextTick(function() {
          this.$refs.reply.focus();
        });
      }, 0);
    },
    async postReply(event) {
      let targetID = parseInt(event.currentTarget.id);
      if (this.replyComment !== "") {
        let credentials = {
          memberName: this.$store.state.userName,
          commentBy: this.$store.state.userId,
          articleNumber: targetID,
          replyTo: this.currentCommentID,
          comment: this.replyComment,
        };
        await DirectoryService.addReply(credentials);
        this.dialog = false;
        this.replyComment = "";
        this.getComments();
      } else {
        this.snackBarMessage = "Reply cannot be empty";
        this.snackbar = true;
      }
    },
    cancelReply() {
      this.dialog = false;
      this.replyComment = "";
    },
    articleClick() {},
    async followingAndBookmarked() {
      let followingAndBookmarked = {
        member: this.$store.state.userId,
        member_following: this.cards.member,
        article: this.cards.id,
      };
      let followingResponse = await DirectoryService.followingAndBookmarked(
        followingAndBookmarked
      );
      if (!followingResponse.data[0].length) {
        this.bookMarked = false;
        this.bookmarkColor = "grey";
      } else {
        this.bookMarked = true;
        this.bookmarkColor = "indigo";
      }
      if (!followingResponse.data[1].length) {
        this.following = false;
        this.followingColor = "grey";
        this.followingIcon = "mdi-motion-sensor";
        this.followingText = "follow";
      } else {
        this.following = true;
        this.followingColor = "indigo";
        this.followingIcon = "mdi-motion-sensor-off";
        this.followingText = "following";
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
          claps: this.claps,
        };
        let response = await DirectoryService.addLikes(credentials);
        console.log(response.data);
        this.nowClapps = this.claps;
      }
    },
    async bookmark() {
      let toBookMark;
      if (!this.bookMarked) {
        this.bookMarked = true;
        this.bookmarkColor = "indigo";
        toBookMark = true;
      } else {
        this.bookMarked = false;
        this.bookmarkColor = "grey";
        toBookMark = false;
      }
      let bookMark = {
        member: this.$store.state.userId,
        article: this.cards.id,
        toBookMark: toBookMark,
      };
      await DirectoryService.bookMark(bookMark);
    },
    async follow() {
      let toFollow;
      if (!this.following) {
        this.following = true;
        this.followingColor = "indigo";
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
        toFollow: toFollow,
      };
      await DirectoryService.follow(follow);
    },
  },
  async beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    if (this.tokenValid) {
      let credentials = {
        articleID: this.cards.id,
      };
      await DirectoryService.updateArticleLikes(credentials);
    }
  },
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
ul {
  list-style-type: none;
}

.commentsUL {
  list-style-type: none;
}

.comment:hover {
  background-color: rgba(169, 165, 165, 0.2);
}
.commentReply:hover {
  background-color: rgba(169, 165, 165, 0.2);
}
.commentReply {
  font-size: 100%;
  background-color: rgba(107, 133, 189, 0.1);
  border: 1px solid rgba(107, 133, 189, 0.1);
  border-radius: 7px;
}
.comment {
  font-size: 100%;
  background-color: rgba(201, 125, 195, 0.1);
  border: 1px solid rgba(107, 133, 189, 0.1);
  border-radius: 7px;
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
}
</style>
