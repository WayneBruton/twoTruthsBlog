import DirectoryService from "../services/DirectoryServices";
import moment from "moment";
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          timeOut: 2000,
          snackbarMessage: ""
        };
      },
      methods: {
        articleClick(event) {
          let targetID = event.currentTarget.id;
          if (this.tokenValid && this.$store.state.isLoggedOn) {
            let credentials = {
              thisMonth: moment(new Date())
                // .add(1, "month")
                .format("MMMM YYYY")
            };
            this.$store.dispatch("allowedToView", credentials);
          }
          setTimeout(() => {
            if (!this.$store.state.isLoggedOn) {
              this.$emit("notLoggedIn");
            } else if (!this.$store.state.allowedToView) {
              this.$store.dispatch("showSubscribe");
            } else {
              this.$router.push({ name: "articles", query: { id: targetID } });
            }
          }, 0);
        },
        sizeOfFile() {
          if (this.file.size > 1000000) {
            this.file = [];
            this.snackBarMessage = "File size cannot exceed 20Mb";
            return (this.snackbar = true);
          }
        },

        discardThisPost() {
          this.deleteCoverImageWhenDiscarding();
          let i;
          for (i = 0; i < this.articleImagesArray.length; i++) {
            if (this.content.includes(this.articleImagesArray[i].url)) {
              this.imageToDelete = this.articleImagesArray[i];
              this.deleteCurrentArticleImage();
            }
          }
          this.content = "<p>Enter images and article here</p>";
          this.file = null;
          this.title = "";
          this.credit = "";
        },
        async deleteCurrentArticleImage() {
          if (this.imageToDelete) {
            try {
              await DirectoryService.removeImage(this.imageToDelete);
            } catch (e) {
              this.snackbarMessage = "Could not delete Image";
              this.snackbar = true;
            }
          }
        },
        async deleteCoverImageWhenDiscarding() {
          if (
            this.src.url.includes("cloudinary") &&
            this.src.url_id !== "ancientruins"
          ) {
            try {
              await DirectoryService.removeImage(this.src);
              this.src = this.originalsrc;
            } catch (e) {
              this.snackbarMessage = "Could not delete Image";
              this.snackbar = true;
            }
          }
        },
        async deleteCover() {
          if (
            this.oldsrc.url.includes("cloudinary") &&
            this.oldsrc.url_id != "ancientruins"
          ) {
            try {
              await DirectoryService.removeImage(this.oldsrc);
            } catch (e) {
              this.snackbarMessage = "Could not delete Image";
              this.snackbar = true;
            }
          }
        },
        async uploadCoverFiles() {
          // this.progressBarActive = true;
          if (this.file.size > parseInt(process.env.VUE_APP_FILESIZE)) {
            this.file = [];
            this.snackBarMessage = "File size cannot exceed 2Mb";
            this.snackbar = true;
            // return this.progressBarActive = false;
            return (this.snackbar = true);
          } else if (this.file.size < 2000000) {
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
          }
        },
        addNewTags() {
          this.newTags = [];
          this.articleTags.forEach(el => {
            let tag = el;
            let result = this.tags.filter(element => {
              return element === tag;
            });
            if (!result.length) {
              this.newTags.push(tag);
            }
            // console.log(this.newTags);
          });
        },
        resizePageSize() {
          if (this.windowWidth < 768) {
            this.flex = 12;
            this.offset = 0;
          } else {
            this.flex = 6;
            this.offset = 3;
          }
        },
        articleTagsCount() {
          if (this.articleTags.length > 5) {
            this.articleTags.pop();
            this.snackBarMessage = "Only 5 tags allowed";
            this.snackbar = true;
          }
        },
        watchContent() {
          const searchRegExp = /<\/p>/g;
          const replaceWith = " </p>";
          this.content = this.content
            .replace(searchRegExp, replaceWith)
            .split(/\s+/)
            .join(" ");
          let i;
          for (i = 0; i < this.articleImagesArray.length; i++) {
            if (!this.content.includes(this.articleImagesArray[i].url)) {
              this.imageToDelete = this.articleImagesArray[i];
              this.deleteArticleImage();
              this.articleImagesArray.splice(i, 1);
            }
          }
        },
        customToolBarInit() {
          this.customToolbar = [
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
          ];
        }
      }
    });
  }
};

export default MyPlugin;
