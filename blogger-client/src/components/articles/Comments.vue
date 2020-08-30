<template>
  <div>
    <v-expansion-panels popout large dark color="#111d5e">
      <v-expansion-panel color="#111d5e">
        <v-expansion-panel-header color="#111d5e" class="header"
          ><h2 style="color: white;">
            Comments so far ( {{ comments.length }} )
          </h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          style="background-color: white; color:black;"
        >
          <br />
          <h3 style="padding-left: 5px;">Add Comment</h3>
          <div style="display: flex; align-items: flex-end;">
            <v-textarea
              style="margin: 15px 15px; padding: 5px 10px;"
              placeholder="Add a Comment"
              v-model="addComment"
              light
              rounded
              solo
              counter="250"
              maxLength="250"
              rows="4"
            ></v-textarea>
            <v-btn
              v-if="addComment"
              :id="this.$store.state.userId"
              style="margin-bottom: 50px; color: black;"
              icon
              text
              @click="addNewComment($event)"
              ><v-icon color="green">mdi-comment</v-icon>+</v-btn
            >
          </div>
          <v-col :cols="12">
            <v-toolbar color="rgba(171, 177, 184, 0.2)" elevation="0">
              <v-spacer></v-spacer>
              <v-toolbar-title style="color: black;"
                >Comments {{ comments.length }}</v-toolbar-title
              >
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
                <v-card max-width="1000" class="mx-auto comment" elevation="0">
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
                        style="width: 100%; color: black; "
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
                                item.writtenBy === item.currentUser ||
                                item.isAdmin == 1
                            "
                            :id="item.id"
                            @click="deleteComment($event)"
                            ><v-icon color="red">mdi-delete</v-icon></v-btn
                          >
                          <!-- I AM HERE -->
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
                            ><v-icon color="green">mdi-reply</v-icon></v-btn
                          >
                        </template>
                        <span>Reply</span>
                      </v-tooltip>
                    </v-card-actions>
                  </div>
                </v-card>

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
                            style="color: black; "
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
                                  reply.commentBy === item.currentUser ||
                                    item.writtenBy === item.currentUser ||
                                    item.isAdmin == 1
                                "
                                :id="reply.id"
                                @click="deleteReply($event)"
                                ><v-icon color="red">mdi-delete</v-icon></v-btn
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
              <v-btn text color="#111d5e" @click="cancelReply">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :id="currentArticle"
                text
                color="#111d5e"
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
import DirectoryService from "@/services/DirectoryServices";
export default {
  name: "comments",
  props: ["currentArticle", "authorId"],
  data: () => ({
    comments: [],
    addComment: "",
    showComments: true,
    showCommentsIcon: "mdi-comment-text",
    showCommentsTooltip: "Show",
    replyComment: "",
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    publicID: "",

    snackbar: false,
    snackBarMessage: "",
    dialog: false,
    timeOut: 1500
  }),
  mounted() {
    this.getComments();
  },
  methods: {
    async addNewComment(event) {
      if (this.addComment !== "") {
        let targetID = event.currentTarget.id;
        let credentials = {
          memberName: this.$store.state.userName,
          commentBy: targetID,
          articleNumber: this.currentArticle, //PROP???
          comment: this.addComment
        };
        try {
          await DirectoryService.addComment(credentials);
          this.addComment = "";
          this.showComments = false;
          this.displayComments();
        } catch (e) {
          this.snackBarMessage = "Comment can't be empty";
          this.snackbar = true;
        }
      } else {
        this.snackBarMessage = "Comment can't be empty";
        this.snackbar = true;
      }
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
    async getComments() {
      let search = window.location.search;
      let query = search.replace("?", "").split("=");
      let credentials = query[query.length - 1];
      let comments = {
        id: credentials
      };
      try {
        let commentsResponse = await DirectoryService.getComments(comments);

        commentsResponse.data.forEach(el => {
          el.currentUser = this.$store.state.userId;
          el.isAdmin = this.$store.state.isAdmin;
          // el.writtenBy = this.cards.member;
          el.writtenBy = this.authorId;
        });
        this.comments = commentsResponse.data;
        // console.log(this.comments);
        this.showComments = true;
      } catch (e) {
        this.snackBarMessage = "Something went wrong, please try later";
        this.snackbar = true;
      }
    },
    async deleteComment(event) {
      let targetID = parseInt(event.currentTarget.id);
      let credentials = {
        id: targetID
      };
      try {
        await DirectoryService.deleteComment(credentials);
        this.getComments();
      } catch (e) {
        this.snackBarMessage = "Error deleting comment";
        this.snackbar = true;
      }
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
    async deleteReply(event) {
      let targetID = parseInt(event.currentTarget.id);
      let credentials = {
        id: targetID
      };
      try {
        await DirectoryService.deleteReply(credentials);
        this.getComments();
      } catch (e) {
        this.snackBarMessage = "Error deleting comment";
        this.snackbar = true;
      }
    },
    async postReply(event) {
      let targetID = parseInt(event.currentTarget.id);
      if (this.replyComment !== "") {
        let credentials = {
          memberName: this.$store.state.userName,
          commentBy: this.$store.state.userId,
          articleNumber: targetID,
          replyTo: this.currentCommentID,
          comment: this.replyComment
        };
        try {
          await DirectoryService.addReply(credentials);
          this.dialog = false;
          this.replyComment = "";
          this.getComments();
        } catch (e) {
          this.snackBarMessage = "Error posting a reply";
          this.snackbar = true;
        }
      } else {
        this.snackBarMessage = "Reply cannot be empty";
        this.snackbar = true;
      }
    },
    cancelReply() {
      this.dialog = false;
      this.replyComment = "";
    }
  }
};
</script>

<style scoped>
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
</style>
