// import DirectoryService from "../services/DirectoryServices";
import DirectoryService from "../services/DirectoryServices";
const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {};
      },
      methods: {
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
            await DirectoryService.removeImage(this.imageToDelete);
          }
        },
        async deleteCoverImageWhenDiscarding() {
          if (
            this.src.url.includes("cloudinary") &&
            this.src.url_id !== "ancientruins"
          ) {
            await DirectoryService.removeImage(this.src);
            this.src = this.originalsrc;
          }
        },
        async deleteCover() {
          if (
            this.oldsrc.url.includes("cloudinary") &&
            this.oldsrc.url_id != "ancientruins"
          ) {
            await DirectoryService.removeImage(this.oldsrc);
          }
        },
        async uploadCoverFiles() {
          this.progressBarActive = true;
          try {
            this.sizeOfFile();
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
