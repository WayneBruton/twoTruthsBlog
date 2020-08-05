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
      <v-container fluid v-if="content">
        <v-row dense justify-center>
          <v-col :cols="flex" :offset="offset">
            <h2>Preview</h2>
          </v-col>
        </v-row>
        <v-row dense justify-cente>
          <v-col :cols="flex" :offset="offset">
            <v-card class="preview" cols="12">
              <!-- gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" -->
              <!-- <v-img
                :src="src.url"
                class="white--text align-end"
                height="200px"
              >
                <v-card-title v-text="title"></v-card-title>
              </v-img> -->

              <cld-image
                :cloudName="cloudName"
                :publicId="src.url_id"
                class="white--text align-end"
                loading="lazy"
              >
                <cld-transformation crop="fill" quality="auto" />
              </cld-image>
              <v-card-title v-text="title"></v-card-title>

              <v-card-text v-text="credit"></v-card-text>
              <v-card-text v-html="content"></v-card-text>
              <v-card-text>About Words:{{ word_count }}</v-card-text>
              <vue-countable
                :text="content"
                :elementId="'myId'"
                :stripTags="true"
                :hardReturns="true"
                @change="change"
              ></vue-countable>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon>mdi-book-open-page-variant</v-icon>
                </v-btn>
              </v-card-actions>
              <hr />
              <v-col :cols="12">
                <div
                  style="background-color: white; border: 1px solid white; border-radius: 7px; display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap;"
                >
                  <!-- publicId="s3hazfg7jpi3jxskhjdx" -->
                  <cld-image
                    v-if="this.$store.state.avatar"
                    :cloudName="cloudName"
                    :publicId="publicID"
                  >
                    <!-- effect="sepia" -->
                    <cld-transformation
                      crop="fill"
                      gravity="face"
                      border="2px_solid_transparent"
                      radius="max"
                      width="70"
                      height="70"
                      quality="auto"
                      loading="lazy"
                    />
                    <!-- <cld-transformation overlay={{ text: "Love" }} effect="colorize" color="#f08" /> -->
                  </cld-image>
                  <div style=" width: 60%; padding: 10px 5px;">
                    <p>Name: {{ this.$store.state.userName }}</p>
                    <p>
                      email:
                      <a :href="email">{{ this.$store.state.email }}</a>
                    </p>
                    <p v-if="this.$store.state.website">
                      website:
                      <a :href="website" target="_blank">{{ website }}</a>
                    </p>
                  </div>
                </div>
              </v-col>
            </v-card>
          </v-col>
          <br />
          <br />
        </v-row>
      </v-container>
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <div
            v-if="this.windowWidth < 768"
            style="display: flex; flex-direction: column; align-items: left;"
          >
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
          <div v-else style="display: flex; justify-content: space-around;">
            <v-btn @click="discardPost" color="primary" text>
              <v-icon>mdi-delete</v-icon>Discard
            </v-btn>
            <v-btn
              id="draft"
              color="primary"
              text
              @click="publishArticle($event)"
            >
              <v-icon>mdi-cloud-upload</v-icon>Save to Drafts
            </v-btn>
            <v-btn
              id="publish"
              color="primary"
              text
              @click="publishArticle($event)"
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
export default {
  name: "uploadArticle",
  components: {
    VueEditor
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
        url_id: "sample"
      },
      originalsrc: {
        url: `${process.env.VUE_APP_BASEURL}alejandro-escamilla-10-unsplash.jpg`,
        url_id: "alejandro-escamilla-10-unsplash"
      },
      oldsrc: "",
      email: `mailTo:${this.$store.state.email}`,
      title: "Sample Title & Image",
      credit: "Credit goes here",
      word_count: 100,
      website: this.$store.state.website,
      file: null,
      // isError: false,
      // errorText: null,
      windowWidth: null,
      customToolbar: [
        [
          {
            header: [false, 1, 2, 3, 4, 5, 6]
          }
        ],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          {
            align: ""
          },
          {
            align: "center"
          },
          {
            align: "right"
          },
          {
            align: "justify"
          }
        ],
        ["blockquote", "code-block"],
        [
          {
            list: "ordered"
          },
          {
            list: "bullet"
          }
        ],
        [
          {
            indent: "-1"
          },
          {
            indent: "+1"
          }
        ], // outdent/indent
        [
          {
            color: []
          },
          {
            background: []
          }
        ], // dropdown with defaults from theme
        ["link", "image"],
        ["clean"] // remove formatting button
      ],
      snackbar: false,
      snackBarMessage: "",
      timeOut: 3000,
      articleTags: [],
      tags: [],
      newTags: []
    };
  },
  watch: {
    content: function() {
      const searchRegExp = /<\/p>/g;
      const replaceWith = " </p>";
      this.content = this.content
        .replace(searchRegExp, replaceWith)
        .split(/\s+/)
        .join(" ");
      // const searchRegExpP = /<p>/g;
      // const replaceWithP = `<p style="text-align: left;">`;
      // this.content = this.content
      //   .replace(searchRegExpP, replaceWithP)
      //   .split(/\s+/)
      //   .join(" ");
      let i;
      for (i = 0; i < this.articleImagesArray.length; i++) {
        if (!this.content.includes(this.articleImagesArray[i].url)) {
          this.imageToDelete = this.articleImagesArray[i];
          this.deleteArticleImage();
          this.articleImagesArray.splice(i, 1);
        }
      }
    },
    articleTags: function() {
      if (this.articleTags.length > 5) {
        this.articleTags.pop();
        this.snackBarMessage = "Only 5 tags allowed";
        this.snackbar = true;
      }
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
    this.windowWidth = window.innerWidth;
    setTimeout(() => {
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });
      this.resizePage();
    }, 0);
    // if (this.windowWidth < 768) {
    //   this.flex = 12;
    //   this.offset = 0;
    // } else {
    //   this.flex = 6;
    //   this.offset = 3;
    // }
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
      if (this.windowWidth < 768) {
        this.flex = 12;
        this.offset = 0;
      } else {
        this.flex = 6;
        this.offset = 3;
      }
    },
    addNewTag() {
      this.newTags = [];
      this.articleTags.forEach(el => {
        let tag = el;
        let result = this.tags.filter(element => {
          return element === tag;
        });
        if (!result.length) {
          this.newTags.push(tag);
        }
      });
    },
    async uploadFiles() {
      this.progressBarActive = true;
      try {
        var formData = new FormData();
        formData.append("file", this.file);
        let response = await DirectoryService.uploadCoverImage(formData);
        let url = response.data.url;
        let url_id = response.data.url_id;
        let imageInfo = {
          url,
          url_id
        };
        this.oldsrc = this.src;
        this.deleteCoverImage();
        this.src = imageInfo;
        this.progressBarActive = false;
      } catch (e) {
        this.snackBarMessage = "There was a problem. Try again later";
        this.snackbar = true;
      } finally {
        this.progressBarActive = false;
      }
    },
    async deleteCoverImage() {
      if (this.oldsrc.url.includes("cloudinary")) {
        // let response = await DirectoryService.removeImage(this.oldsrc);
        await DirectoryService.removeImage(this.oldsrc);
        // this.src = this.originalsrc;
      }
      // else {
      //   console.log("Only Original Image");
      // }
    },
    async deleteCoverImageOnDiscard() {
      if (this.src.url.includes("cloudinary")) {
        // let response = await DirectoryService.removeImage(this.src);
        await DirectoryService.removeImage(this.src);
        this.src = this.originalsrc;
      }
      // else {
      //   console.log("Only Original Image");
      // }
    },
    async deleteArticleImage() {
      if (this.imageToDelete) {
        // let response = await DirectoryService.removeImage(this.imageToDelete);
        await DirectoryService.removeImage(this.imageToDelete);
      }
      // else {
      //   console.log("Only Original Image");
      // }
    },
    discardPost() {
      this.deleteCoverImageOnDiscard();
      let i;
      for (i = 0; i < this.articleImagesArray.length; i++) {
        if (this.content.includes(this.articleImagesArray[i].url)) {
          this.imageToDelete = this.articleImagesArray[i];
          this.deleteArticleImage();
          this.articleImagesArray.splice(i, 1);
        }
      }
      this.content = "<p>Enter images and article here</p>";
      this.file = null;
      (this.title = ""), (this.credit = "");
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
    change(event) {
      this.word_count = event.words;
    },
    size() {
      if (this.file.size > 20000000) {
        this.file = [];
        this.snackBarMessage = "File size cannot exceed 20Mb";
        return (this.snackbar = true);
      } else {
        //
      }
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
          setTimeout(() => {
            this.$router.push({ name: "setup" });
          }, 3000);
        } else if (response.data.Awesome && isDraft) {
          this.snackBarMessage = "Saved to Drafts";
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push({ name: "setup" });
          }, 3000);
        }
      } else {
        this.snackBarMessage = "You must have at least one tag";
        this.snackbar = true;
      }
    }
  }
};
</script>

<style scoped>
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

div >>> .ql-align-center {
  text-align: center;
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
/* div >>> img {
  width: 80%;
} */
div >>> p,
div >>> h1,
div >>> h2,
div >>> h3,
div >>> h4,
div >>> h5,
div >>> h6,
div >>> li,
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
.preview {
  border: 2px solid black;
}
</style>
