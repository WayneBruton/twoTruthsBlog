<template>
  <div class="about">
    <v-container fluid v-if="this.$store.state.isLoggedOn">
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <h1>Upload Article</h1>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <v-file-input
            show-size
            ref="file"
            accept="image/*"
            label="Cover image"
            v-model="file"
            @change="uploadFiles"
          ></v-file-input>
          <br />
        </v-col>
        <br />
        <v-col :cols="flex" :offset="offset">
          <v-text-field label="Article Title" v-model="title"></v-text-field>
        </v-col>
        <br />
        <v-col :cols="flex" :offset="offset">
          <v-text-field label="Image Credits" v-model="credit"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <br />
    <v-container fluid v-if="this.$store.state.isLoggedOn">
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <v-progress-linear
            v-if="progressBarActive"
            color="primary accent-4"
            indeterminate
            rounded
            height="16"
          ></v-progress-linear>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <vue-editor
            id="editor"
            :editor-toolbar="customToolbar"
            useCustomImageHandler
            @image-added="handleImageAdded"
            v-model="content"
          ></vue-editor>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <v-progress-linear
            v-if="progressBarActive"
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="16"
          ></v-progress-linear>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <br />
          <v-combobox
            v-model="articleTags"
            :items="tags"
            counter="5"
            maxValue="5"
            label="Enter up to 5 tags"
            multiple
            chips
            deletable-chips
            dense
            item-color="#111d5e"
          ></v-combobox>
          <!-- {{ date }} {{ time }} -->
          <v-btn
            @click="resetTime"
            color="#111d5e"
            text
            style="margin-bottom: 5px;"
          >
            <v-icon>mdi-undo-variant</v-icon>Now
          </v-btn>
        </v-col>
        <v-col :cols="flex / 2" :offset="offset">
          <br />
          <v-menu
            ref="datemenu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="Publish Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.datemenu.save(date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col :cols="flex / 2" :offset="0">
          <br />
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="time"
                label="Publish Time"
                prepend-icon="mdi-clock-time-two"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="time"
              full-width
              @click:minute="$refs.menu.save(time)"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
      <br />

      <PreviewArticle
        v-if="content"
        :title="title"
        :flex="flex"
        :offset="offset"
        :cloudName="cloudName"
        :src="src"
        :credit="credit"
        :content="content"
        :word_count="word_count"
        :website="website"
        :publicID="publicID"
      />

      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <div class="publish">
            <v-btn
              @click="discardPost"
              color="#111d5e"
              text
              style="margin-bottom: 5px;"
            >
              <v-icon>mdi-delete</v-icon>Discard
            </v-btn>
            <v-btn
              id="draft"
              color="#111d5e"
              text
              @click="publishArticle($event)"
              style="margin-bottom: 5px;"
            >
              <v-icon>mdi-cloud-upload</v-icon>Save to Drafts
            </v-btn>
            <v-btn
              id="publish"
              color="#111d5e"
              text
              @click="publishArticle($event)"
              style="margin-bottom: 5px;"
            >
              <v-icon>mdi-publish</v-icon>Publish
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-row justify="center">
      <v-dialog v-model="leaveDialog" persistent max-width="350">
        <v-card>
          <v-card-title class="headline">
            <v-img
              style="margin-top: 10px;"
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              transition="scale-transition"
              width="40"
              :src="logosrc"
            />
            Unsaved Changes</v-card-title
          >
          <v-card-text
            >You have unsaved changes. If you leave this page, these changes
            will be lost</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="closeDialog">Stay</v-btn>
            <v-spacer></v-spacer>

            <v-btn color="blue" text @click="discardChangesandMove"
              >Leave</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import DirectoryService from "../services/DirectoryServices";
// import PreviewArticle from "../components/PreviewArticle";
export default {
  name: "uploadArticle",
  components: {
    VueEditor,
    PreviewArticle: () => import("../components/PreviewArticle")
  },
  data() {
    return {
      leaveDialog: false,
      to: null,
      logosrc: require("../assets/Logo.png"),
      progressBarActive: false,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      // error: "",
      preset: `${process.env.VUE_APP_PRESET}`,
      publicID: this.$store.state.avatar,
      content: "",
      // publishDate: "",

      date: new Date().toISOString().substr(0, 10),
      menu: false,
      time: new Date().toLocaleTimeString(),
      menu2: false,

      articleImages: 0,
      articleImagesArray: [],
      imageToDelete: {},
      flex: 8,
      offset: 2,
      src: {
        url: `${process.env.VUE_APP_BASEURL}alejandro-escamilla-10-unsplash.jpg`,
        url_id: "ancientruins"
      },
      originalsrc: {
        url: `${process.env.VUE_APP_BASEURL}alejandro-escamilla-10-unsplash.jpg`,
        url_id: "ancientruins"
      },
      oldsrc: "",
      email: `mailTo:${this.$store.state.email}`,
      title: "Sample Title & Image",
      credit: "Credit goes here",
      word_count: 100,
      website: this.$store.state.website,
      file: null,
      windowWidth: null,
      customToolbar: [],
      snackbar: false,
      snackBarMessage: "",
      timeOut: 3000,
      articleSaved: false,
      articleTags: [],
      tags: [],
      newTags: []
    };
  },
  watch: {
    content: function() {
      this.watchContent();
    },
    articleTags: function() {
      this.articleTagsCount();
    },
    windowWidth: function() {
      this.resizePage();
    }
  },
  computed: {},
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  async mounted() {
    this.customToolBarInit();

    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
    let response = await DirectoryService.getTags();
    this.articleTags = [];
    this.tags = [];
    response.data.forEach(el => {
      this.tags.push(el.tag);
    });
    if (this.$store.state.avatar === null) {
      this.publicID = "";
    } else {
      this.publicID = this.$store.state.avatar;
    }
  },
  methods: {
    resetTime() {
      this.date = new Date().toISOString().substr(0, 10);
      this.time = new Date().toLocaleTimeString();
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resizePage() {
      this.resizePageSize();
    },
    addNewTag() {
      this.addNewTags();
    },
    uploadFiles() {
      // this.sizeOfFile();
      this.uploadCoverFiles();
    },
    deleteCoverImage() {
      this.deleteCover();
    },
    async deleteCoverImageOnDiscard() {
      this.deleteCoverImageWhenDiscarding();
    },
    deleteArticleImage() {
      this.deleteCurrentArticleImage();
    },
    discardPost() {
      this.discardThisPost();
      window.scrollTo(0, 0);
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      if (file.size > parseInt(process.env.VUE_APP_FILESIZE)) {
        this.snackBarMessage = "Article image cannot exceed 2Mb";
        this.snackbar = true;
        // return this.progressBarActive = false;
        return (this.snackbar = true);
      } else {
        this.progressBarActive = true;
        var formData = new FormData();
        formData.append("image", file);
        // console.log("file Size", file.size);
        let response = await DirectoryService.uploadImageInEditor(formData);
        let url = response.data.url;
        let url_id = response.data.url_id;
        let imageInfo = {
          url,
          url_id
        };
        this.articleImagesArray.push(imageInfo);
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
        this.progressBarActive = false;
      }
    },
    size() {
      this.sizeOfFile();
    },
    async publishArticle(event) {
      this.addNewTag();
      let targetID = event.currentTarget.id;
      let isDraft;
      if (targetID === "publish") {
        isDraft = false;
      } else {
        isDraft = true;
      }
      if (this.articleTags.length) {
        let article = {
          member: this.$store.state.userId,
          member_name: this.$store.state.userName,
          coverImgURL: this.src.url,
          coverImgID: this.src.url_id,
          title: this.title,
          credit: this.credit,
          content: this.content,
          tags: JSON.stringify(this.articleTags),
          isDraft: isDraft,
          newTags: JSON.stringify(this.newTags),
          //I AM HERE TO ADD THIS FIELD
          articleImages: JSON.stringify(this.articleImagesArray),
          publish_date: `${this.date} ${this.time}`
        };
        let response = await DirectoryService.uploadArticle(article);
        if (response.data.Awesome && !isDraft) {
          this.snackBarMessage = "Successfully Published";
          this.snackbar = true;
          this.articleSaved = true;
          // setTimeout(() => {
          //   this.$router.push({ name: "setup" });
          // }, 3000);
        } else if (response.data.Awesome && isDraft) {
          this.snackBarMessage = "Saved to Drafts";
          this.snackbar = true;
          this.articleSaved = true;
          // setTimeout(() => {
          //   this.$router.push({ name: "setup" });
          // }, 3000);
        }
      } else {
        this.snackBarMessage = "You must have at least one tag";
        this.snackbar = true;
      }
    },
    closeDialog() {
      this.leaveDialog = false;
      this.to = null;
    },
    discardChangesandMove() {
      this.leaveDialog = false;
      this.discardThisPost();
      this.$router.push(this.to);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      !this.articleSaved &&
      (this.content !== "" || this.src.url_id !== "ancientruins")
    ) {
      if (this.to) {
        next();
      } else {
        this.to = to;
        this.leaveDialog = true;
      }
    } else {
      next();
    }
  }
};
</script>

<style scoped>
.publish {
  display: flex;
  justify-content: space-around;
}
.coverImg {
  size: 120%;
  align-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  left: 0px;
}
@media only screen and (max-width: 768px) {
  .publish {
    display: flex;
    flex-direction: column;
    align-items: left;
  }
}
</style>
