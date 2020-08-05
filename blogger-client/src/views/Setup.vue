<template>
  <div class="about">
    <br />
    <br />
    <v-container fluid v-if="this.$store.state.isLoggedOn">
      <v-row dense justify-center>
        <v-col :cols="flex" :offset="offset">
          <h1>Profile</h1>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <v-file-input
            show-size
            ref="file"
            accept="image/*"
            label="Profile image"
            v-model="file"
            @change="uploadFiles"
          ></v-file-input>
        </v-col>
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
          </v-row>
        </v-container>
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
        <v-col :cols="flex" :offset="offset">
          <v-text-field label="Name" v-model="name"></v-text-field>
          <v-text-field
            disabled
            type="email"
            label="email"
            v-model="email"
          ></v-text-field>
          <v-radio-group
            :mandatory="true"
            v-model="radioGroup"
            class="choice"
            @change="showMyEmail($event)"
            row
          >
            <v-radio
              v-for="item in emailChoice"
              :key="item.id"
              :label="`${item.label}`"
              :value="item.id"
            ></v-radio>
          </v-radio-group>
          <v-text-field
            label="website"
            placeholder="insert your website url here - www."
            v-model="website"
            @blur="updateWebAddress"
          ></v-text-field>
          <v-textarea
            style="margin: 15px 15px; background-color:  rgba(176, 196, 222, 0.1); padding: 10px 10px;"
            counter="500"
            maxlength="500"
            placeholder="Tell us about yourself"
            v-model="aboutMember"
          >
          </v-textarea>
        </v-col>
        <v-col :cols="flex" :offset="offset">
          <br />
          <v-combobox
            v-model="articleTags"
            :items="tags"
            label="Enter topics you are interested in."
            multiple
            chips
            deletable-chips
            dense
            item-color="indigo"
          ></v-combobox>
        </v-col>
        <br /><br />
      </v-row>

      <v-col :cols="flex" :offset="offset">
        <v-btn text color="indigo" @click="discardChanges">Discard</v-btn>
        <v-btn text color="indigo" @click="updateUser">Save</v-btn>
      </v-col>
      <br />

      <v-col :cols="flex" :offset="offset">
        <div
          style="background-color: rgba(171, 177, 184, 0.2); padding: 10px; border: 1px solid rgba(171, 177, 184, 0.2); border-radius: 7px; display: flex; justify-content: space-around;"
        >
          <v-spacer></v-spacer>

          <div>
            <span><strong>This Month: </strong></span>
            <span>{{ currentMonthLikes }} likes</span>
          </div>
          <v-spacer></v-spacer>
          <div>
            <span><strong>Cumulative: </strong></span>
            <span>{{ totalLikes }} likes</span>
          </div>
          <v-spacer></v-spacer>
        </div>
      </v-col>
    </v-container>
    <v-col :cols="flex" :offset="offset">
      <v-card class="mx-auto" width="100%">
        <v-toolbar color="rgba(171, 177, 184, 0.2)" elevation="0" height="30">
          <v-spacer></v-spacer>
          <v-toolbar-title>Stats</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-tabs
          height="80"
          show-arrows
          v-model="tab"
          background-color="indigo"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#tab-1" v-if="bookmarks.length">
            <small>Bookmarks</small>
            <v-badge color="green" :content="bookmarks.length">
              <v-icon>mdi-bookmark</v-icon>
            </v-badge>
          </v-tab>
          <v-tab href="#tab-2" v-if="following.length">
            <small>Following</small>
            <v-badge color="green" :content="following.length">
              <v-icon>mdi-walk</v-icon>
            </v-badge>
          </v-tab>
          <v-tab href="#tab-3" v-if="published.length">
            <small>Published</small>
            <v-badge color="green" :content="published.length">
              <v-icon>mdi-publish</v-icon>
            </v-badge>
          </v-tab>
          <v-tab href="#tab-4" v-if="drafts.length">
            <small>Drafts</small>
            <v-badge color="green" :content="drafts.length || 0">
              <v-icon>mdi-cloud-upload</v-icon>
            </v-badge>
          </v-tab>
          <v-tab href="#tab-5" v-if="followers.length">
            <small>Followers</small>
            <v-badge color="green" :content="followers.length || 0">
              <v-icon>mdi-human-male-female</v-icon>
            </v-badge>
          </v-tab>
          <v-tab href="#tab-6" v-if="followers.length">
            <small>Popular Tags</small>
            <v-badge color="green" :content="popularTags.length || 0">
              <v-icon>mdi-tag</v-icon>
            </v-badge>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="i in 6" :key="i" :value="'tab-' + i">
            <v-card
              class="mx-auto"
              max-width="1000"
              elevation="1"
              min-height="100"
            >
              <v-toolbar
                color="rgba(171, 177, 184, 0.6)"
                elevation="0"
                v-if="cards.length"
              >
                <!-- MAKE THIS FOR GREATER THAN 5?? -->
                <!-- v-if="cardsFiltered.length > 1" -->
                <v-text-field
                  v-model="search"
                  placeholder="search by title"
                  prepend-icon="mdi-magnify"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn text icon color="indigo" @click="reverseOrder"
                  ><v-icon>{{ reverseIcon }}</v-icon></v-btn
                >
              </v-toolbar>
              <v-list three-line subheader>
                <v-list-item
                  class="cardList"
                  v-for="item in cardsFiltered"
                  :key="item.id"
                  :id="item.id"
                >
                  <v-list-item-icon v-if="windowWidth > 380">
                    <cld-image
                      :cloudName="cloudName"
                      :publicId="item.publicId"
                      loading="lazy"
                      width="50"
                      heigh="50"
                    >
                      <cld-transformation
                        crop="fill"
                        quality="auto"
                        angle="10"
                      />
                    </cld-image>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle>{{
                      item.subTitle
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle v-if="windowWidth > 380">{{
                      item.subTitle2
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <div style="display: flex;">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                            :id="item.viewId"
                            v-if="tab === 'tab-4' || tab === 'tab-3'"
                            @click="editBtn($event)"
                          >
                            <v-icon color="green"
                              >mdi-file-document-edit</v-icon
                            >
                          </v-btn>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-if="tab !== 'tab-5' && tab !== 'tab-6'"
                            v-on="on"
                            icon
                            :id="item.mainId"
                            @click="deleteBtn($event)"
                          >
                            <v-icon color="red">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span v-if="tab === 'tab-1'">remove bookmark</span>
                        <span v-else-if="tab === 'tab-2'">unfollow</span>
                        <span v-else>delete</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            icon
                            :id="item.viewId"
                            v-if="tab === 'tab-3' || tab === 'tab-1'"
                            @click="viewBtn($event)"
                          >
                            <v-icon color="indigo"
                              >mdi-book-open-page-variant</v-icon
                            >
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            icon
                            :id="item.viewId"
                            v-if="tab === 'tab-5' || tab === 'tab-2'"
                            @click="viewProfileBtn($event)"
                          >
                            <v-icon color="indigo">mdi-account-box</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <br />
    <v-col :cols="flex" :offset="offset">
      <hr />
      <hr />
    </v-col>
    <br />
    <!-- DIALOG ON DELETE ARTICLE -->
    <br /><b><br /></b>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete Article</span>
          </v-card-title>
          <v-card-text>
            <v-col
              cols="12"
              xs="12"
              sm="10"
              md="10"
              offset-md="1"
              offset-sm="1"
            >
              {{ dialogMessage }}
            </v-col>
          </v-card-text>
          <v-col cols="12" xs="12" sm="10" md="10" offset-md="1" offset-sm="1">
            <div style="display:flex;justify-content: space-evenly;">
              <v-btn text color="indigo" @click="dialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :id="articleId"
                text
                color="indigo"
                @click="deleteArticle($event)"
                >Delete</v-btn
              >
            </div>
          </v-col>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- SNACK BAR MESSAGE -->
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "setup",
  components: {},
  data() {
    return {
      flex: 8,
      offset: 1,
      file: null,
      radioGroup: 0,
      showEmail: null,
      emailChoice: [
        { id: 1, label: "show Email" },
        { id: 0, label: "hide Email" }
      ],
      cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
      preset: `${process.env.VUE_APP_PRESET}`,
      src: "",
      oldsrc: "",
      orginalsrc: "",
      name: null,
      email: null,
      website: null,
      aboutMember: null,
      aboutMemberOriginal: null,
      progressBarActive: false,
      windowWidth: null,
      snackbar: false,
      snackBarMessage: "",
      timeOut: 3000,
      reverseIcon: "mdi-sort-descending",
      // cardsFiltered:[],
      cards: [],
      item: 0,
      search: "",
      bookmarks: [],
      following: [],
      published: [],
      drafts: [],
      followers: [],
      color: "#d3dbff",
      tab: null,
      dialog: false,
      dialogMessage: `Are you sure you want to delete this article?
                      it cannot be reversed!`,
      articleId: null,
      articleTags: [],
      articleTagsOriginal: [],
      tags: [],
      popularTags: [],
      currentMonthLikes: 0,
      totalLikes: 0
    };
  },
  mounted() {
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
    if (this.$store.state.avatar !== null) {
      this.src = this.$store.state.avatar;
    }
    this.collectData();
  },
  computed: {
    //I AM HERE
    cardsFiltered() {
      if (this.search === "") {
        return this.cards;
      } else {
        return this.cards.filter(el => {
          return (
            !this.search ||
            el.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      }
    }
  },
  watch: {
    //WATCH WHEN TABS CHANGE
    tab: function() {
      if (this.tab === "tab-1") {
        this.cards = [];
        this.updateBookmarksArray();
      } else if (this.tab === "tab-2") {
        this.cards = [];
        this.updateFolowingArray();
        window.scrollTo(1000, 1000);
      } else if (this.tab === "tab-3") {
        this.cards = [];
        this.updatePublishedArray();
      } else if (this.tab === "tab-4") {
        this.cards = [];
        this.updateDraftsArray();
      } else if (this.tab === "tab-5") {
        this.cards = [];
        this.updateFollowersArray();
      } else if (this.tab === "tab-6") {
        this.cards = [];
        this.updatePopularTagsArray();
      }
      console.log("cards", this.cards);
    },
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
      } else {
        this.flex = 6;
        this.offset = 3;
      }
    },
    showMyEmail(event) {
      let targetID = event;
      this.showEmail = targetID;
    },
    //GET DATA FROM DATABASE
    async collectData() {
      let credentials = {
        memberId: this.$store.state.userId
      };
      let response = await DirectoryService.myStuff(credentials);
      console.log(response.data);
      this.name = response.data[6][0].name;
      this.email = response.data[6][0].email;
      this.website = response.data[6][0].website;
      this.aboutMember = response.data[6][0].aboutMember;
      this.showEmail = response.data[6][0].showEmail;
      if (this.showEmail === 0) {
        this.radioGroup = 0;
      } else if (this.showEmail === 1) {
        this.radioGroup = 1;
      }
      if (response.data[5].length) {
        this.articleTags = JSON.parse(response.data[5][0].tags);
      }
      this.articleTagsOriginal = this.articleTags;
      this.aboutMemberOriginal = this.aboutMember;
      this.tags = [];
      response.data[3].forEach(el => {
        this.tags.push(el.tag);
      });
      this.popularTags = response.data[3];
      let drafts = response.data[2].filter(el => {
        return el.isDraft === 1;
      });
      // console.log("DRAFTS", drafts);
      let published = response.data[2].filter(el => {
        return el.isDraft !== 1;
      });
      this.bookmarks = response.data[0];
      this.following = response.data[1];
      this.followers = response.data[4];
      this.drafts = drafts;
      this.published = published;
      console.log(this.bookmarks);
      console.log(this.following);
      console.log(this.drafts);
      console.log(this.published);
      this.cards = [];
      if (this.tab === null || this.tab === "tab-1") {
        this.updateBookmarksArray();
      } else if (this.tab === "tab-2") {
        this.updateFolowingArray();
      } else if (this.tab === "tab-3") {
        this.updatePublishedArray();
      } else if (this.tab === "tab-4") {
        this.updateDraftsArray();
      } else if (this.tab === "tab-5") {
        this.updateFollowersArray();
      } else if (this.tab === "tab-6") {
        this.updatePopularTagsArray();
      }
      this.popularTagsSort();
      this.getHistoryLikes();
    },
    //GET HISTORICAL LIKES
    async getHistoryLikes() {
      let credentials = {
        id: this.$store.state.userId
      };
      let response = await DirectoryService.getHistoryLikes(credentials);
      console.log(response.data);
      if (response.data.currentMonth) {
        this.currentMonthLikes = response.data.currentMonth;
      } else {
        this.currentMonthLikes = 0;
      }
      if (response.data.total) {
        this.totalLikes = response.data.total;
      } else {
        this.totalLikes = 0;
      }

      // this.totalLikes = response.data.total;
    },
    //REVERSE THIS.CARDS
    reverseOrder() {
      this.cardsFiltered.reverse();
      if (this.reverseIcon === "mdi-sort-descending") {
        this.reverseIcon = "mdi-sort-ascending";
      } else {
        this.reverseIcon = "mdi-sort-descending";
      }
    },
    //GET POPULAR TAGS
    popularTagsSort() {
      this.popularTags.sort(
        (a, b) => parseInt(b.timesUsed) - parseInt(a.timesUsed)
      );
      let nonZeroTags = this.popularTags.filter(el => {
        return el.timesUsed !== 0;
      });
      this.popularTags.length = 0;
      this.popularTags = nonZeroTags;
      console.log(this.popularTags);
      // console.log(nonZeroTags);
    },
    //UPDATE POPULAR TAGS
    updatePopularTagsArray() {
      this.cards = [];
      this.popularTags.forEach(el => {
        let data = {
          mainId: el.id,
          title: `${el.tag} - Used ${el.timesUsed} times.`
          // subTitle: `Used ${el.timesUsed} times.`
        };
        this.cards.push(data);
      });
    },
    //UPDATE DRAFTS ARRAY
    updateDraftsArray() {
      this.cards = [];
      this.drafts.forEach(el => {
        let data = {
          mainId: el.id,
          viewId: el.id,
          title: el.title,
          subTitle: "created: " + el.createdAt,
          publicId: el.coverImgID
        };
        this.cards.push(data);
      });
      // this.cardsFiltered = this.cards
    },
    //UPDATE PUBLISHED ARRAY
    updatePublishedArray() {
      this.cards = [];
      this.published.forEach(el => {
        let data = {
          mainId: el.id,
          viewId: el.id,
          title: el.title,
          subTitle: el.claps + " likes",
          subTitle2: "created: " + el.createdAt,
          publicId: el.coverImgID
        };
        this.cards.push(data);
      });
      // this.cardsFiltered = this.cards
    },
    //UPDATE FOLLOWING ARRAY
    updateFolowingArray() {
      this.cards = [];
      this.following.forEach(el => {
        let data = {
          mainId: el.followingId,
          viewId: el.following,
          title: el.name,
          subTitle: "since: " + el.since,
          publicId: el.avatar
        };
        this.cards.push(data);
      });
      // this.cardsFiltered = this.cards
    },
    //UPDATE FOLLOWERS ARRAY
    updateFollowersArray() {
      this.cards = [];
      this.followers.forEach(el => {
        let data = {
          mainId: el.followingId,
          viewId: el.mySelf,
          title: el.name,
          subTitle: "since: " + el.since,
          publicId: el.avatar
        };
        this.cards.push(data);
      });
      // this.cardsFiltered = this.cards
    },
    //UPDATE BOOKMARKS ARRAY
    updateBookmarksArray() {
      this.cards = [];
      this.bookmarks.forEach(el => {
        let data = {
          mainId: el.bookMarkId,
          viewId: el.articleId,
          title: el.title,
          subTitle: el.authorName,
          publicId: el.coverImgID
        };
        this.cards.push(data);
      });
      // this.cardsFiltered = this.cards
    },
    //UPLOAD NEW COVER IMAGE
    async uploadFiles() {
      this.progressBarActive = true;
      try {
        this.oldsrc = this.src;
        var formData = new FormData();
        formData.append("file", this.file);
        let response = await DirectoryService.uploadCoverImage(formData);
        let url_id = response.data.url_id;
        this.src = url_id;
        // this.deleteCoverImage();
        this.progressBarActive = false;
      } catch (e) {
        this.snackBarMessage = "There was a problem. Try again later";
        this.snackbar = true;
      } finally {
        this.progressBarActive = false;
      }
    },
    //DELETE OLD COVER IMGE WHEN CHANGED
    async deleteCoverImage() {
      let credentials = {
        profileId: this.oldsrc
      };
      await DirectoryService.removeProfileImage(credentials);
    },
    //UPDATEWEBSITE FIELD
    updateWebAddress() {
      if (this.website.substring(0, 4) === "www.") {
        this.website = `http://${this.website}`;
      } else if (this.website.substring(0, 11) === "http://www.") {
        this.website = this.website;
      } else if (this.website.substring(0, 12) === "https://www.") {
        this.website = this.website;
      } else {
        this.website = "";
        this.snackBarMessage = "Website not correct";
        this.snackbar = true;
      }
    },
    //DISCARD USER CHANGES
    discardChanges() {
      this.name = this.$store.state.userName;
      this.email = this.$store.state.email;
      this.website = this.$store.state.website;
      if (this.$store.state.avatar !== null) {
        this.src = this.$store.state.avatar;
      }
      this.articleTags = this.articleTagsOriginal;
      this.aboutMember = this.aboutMemberOriginal;
    },
    //UPDATE THE USERS DETAILS
    async updateUser() {
      if (this.oldsrc !== "") {
        this.deleteCoverImage();
      }
      const searchRegExpP = /"/g;
      const replaceWithP = `'`;

      let aboutMember = this.aboutMember.replace(searchRegExpP, replaceWithP);
      // let query = search.replace("?", "").split("=");
      let credentials = {
        id: this.$store.state.userId,
        name: this.name,
        email: this.email,
        website: this.website,
        avatar: this.src,
        tags: JSON.stringify(this.articleTags),
        showEmail: this.showEmail,
        aboutMember: aboutMember
      };
      let response = await DirectoryService.editMember(credentials);
      if (response.data.success === true) {
        let member = {
          name: this.$store.state.userName,
          email: this.$store.state.email,
          id: this.$store.state.userId,
          avatar: this.src,
          website: this.website,
          showEmail: this.showEmail,
          aboutMember: aboutMember
        };
        this.$store.dispatch("setUser", member);
        this.snackBarMessage = "Details saved";
        this.snackbar = true;
      } else {
        this.snackBarMessage = "Something went wrong. Please try again later";
        this.snackbar = true;
      }
    },
    async deleteBtn(event) {
      let targetID = event.currentTarget.id;
      let tab = this.tab;
      //UN BOOKMARK
      if (this.tab === "tab-1") {
        let credentials = {
          id: targetID
        };
        let response = await DirectoryService.removeBookmark(credentials);
        if (response.data.affectedRows === 1) {
          this.collectData();
          this.tab = tab;
        }
      }
      //UN FOLLOW
      if (this.tab === "tab-2") {
        let credentials = {
          id: targetID
        };
        let response = await DirectoryService.unfollow(credentials);
        if (response.data.affectedRows === 1) {
          this.collectData();
          this.tab = tab;
        }
      }
      //DELETE ARTICLE
      if (this.tab === "tab-3" || this.tab === "tab-4") {
        this.dialog = true;
        this.articleId = targetID;
      }
    },
    //DELETE ARTICLE AND IMAGES
    async deleteArticle(event) {
      let targetID = parseInt(event.currentTarget.id);
      let tab = this.tab;
      let imagesToDelete;
      if (tab === "tab-3") {
        imagesToDelete = this.published.filter(el => {
          return el.id === targetID;
        });
      } else if (tab === "tab-4") {
        imagesToDelete = this.drafts.filter(el => {
          return el.id === targetID;
        });
      }
      let imagesArrayInitial = JSON.parse(imagesToDelete[0].articleImages);
      let imagesArray = [];
      if (imagesArrayInitial.length) {
        imagesArrayInitial.forEach(el => {
          imagesArray.push(el.url_id);
        });
      }
      console.log(imagesArray);
      if (imagesToDelete[0].coverImgID !== "sample") {
        imagesArray.push(imagesToDelete[0].coverImgID);
      }
      imagesArray = JSON.stringify(imagesArray);
      let credentials = {
        id: targetID,
        imagesArray: imagesArray
      };
      let response = await DirectoryService.deleteArticle(credentials);
      if (response.data) {
        this.dialog = false;
        this.collectData();
        this.tab = tab;
      }
    },
    //STILL TO DO
    editBtn(event) {
      // let targetID = event.currentTarget.id;
      console.log(targetID);
      let targetID = event.currentTarget.id;
      this.$router.push({ name: "editdraft", query: { id: targetID } });
    },
    //VIEW PUBLISHED ARTICLE
    viewBtn(event) {
      let targetID = event.currentTarget.id;
      this.$router.push({ name: "articles", query: { id: targetID } });
    },
    //VIEW PUBLISHED ARTICLE
    viewProfileBtn(event) {
      let targetID = event.currentTarget.id;
      console.log(targetID);
      this.$router.push({ name: "profileview", query: { id: targetID } });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>

<style scoped>
.cardList {
  display: flex;
}
.cardList:hover {
  background-color: rgba(169, 165, 165, 0.2);
}
/* .choice {
  margin: 2px 2px;
  padding: 3px 2px;
  background-color: rgba(176, 196, 222, 0.5);
  border: 1px solid rgba(176, 196, 222, 0.5);
  border-radius: 5px;
} */
@media only screen and (max-width: 768px) {
  /* .cardList {
    display: flex;
    flex-direction: column;
  } */
}
</style>
