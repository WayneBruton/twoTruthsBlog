<template>
  <v-container fluid v-if="content">
    <v-row dense justify-center>
      <v-col :cols="flex" :offset="offset">
        <h2>Preview</h2>
      </v-col>
    </v-row>

    <v-row dense justify-cente>
      <v-col :cols="flex" :offset="offset">
        <v-card class="preview" cols="12">
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
          <v-card-text>About Words:{{ word_count_Article }}</v-card-text>
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
              <cld-image :cloudName="cloudName" :publicId="publicID">
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
</template>

<script>
export default {
  name: "preview-article",
  props: [
    "title",
    "flex",
    "offset",
    "cloudName",
    "src",
    "credit",
    "content",
    "word_count",
    "publicID",
    "email",
    "website",
  ],
  data() {
    return {
      words_in_article: null,
    };
  },
  methods: {
    change(event) {
      this.words_in_article = event.words;
    },
  },
  computed: {
    word_count_Article() {
      return this.words_in_article;
    },
  },
};
</script>

<style scoped>
.preview {
  background-color: rgb(245, 240, 240);
  border: 2px solid black;
  border-radius: 7px;
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

div >>> img {
  width: 80%;
  align-content: center;
}
div >>> p {
  font-size: 115%;
}
div >>> pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  text-align: justify;
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
  width: 80%;
}
div >>> p,
div >>> h1,
div >>> h2,
div >>> h3,
div >>> h4,
div >>> h5,
div >>> h6,
div >>> li,
div >>> pre {
  text-align: left;
}
div >>> blockquote {
  text-align: center;
}
div >>> li,
ul,
ol {
  font-size: 115%;
}
</style>
