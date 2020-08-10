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
            item-color="indigo"
          ></v-combobox>
        </v-col>
      </v-row>
      <br />

      <PreviewArticle
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
              color="primary"
              text
              style="margin-bottom: 5px;"
            >
              <v-icon>mdi-delete</v-icon>Discard
            </v-btn>
            <v-btn
              id="draft"
              color="primary"
              text
              @click="publishArticle($event)"
              style="margin-bottom: 5px;"
            >
              <v-icon>mdi-cloud-upload</v-icon>Save to Drafts
            </v-btn>
            <v-btn
              id="publish"
              color="primary"
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
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import DirectoryService from "../services/DirectoryServices";
import PreviewArticle from "../components/PreviewArticle";
export default {
  name: "uploadArticle",
  components: {
    VueEditor,
    PreviewArticle
  },
  data() {
    return {
      progressBarActive: false,
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      // error: "",
      preset: `${process.env.VUE_APP_PRESET}`,
      publicID: this.$store.state.avatar,
      content: "<p>Enter images and article here</p>",
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
      this.progressBarActive = true;
      var formData = new FormData();
      formData.append("image", file);
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
          articleImages: JSON.stringify(this.articleImagesArray)
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
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      !this.articleSaved &&
      (this.content !== "<p>Enter images and article here</p>" ||
        this.src.url_id !== "ancientruins")
    ) {
      const answer = window.confirm(
        "Do you really want to leave? you have unsaved changes!"
      );
      if (answer) {
        console.log("Leave", answer);
        this.discardThisPost();
        next();
      } else {
        console.log("STAY", answer);
        next(false);
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
