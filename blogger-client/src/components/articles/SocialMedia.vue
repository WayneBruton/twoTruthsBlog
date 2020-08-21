<template>
  <div>
    <div style="display: flex;">
      <v-spacer></v-spacer>
      <div class="socialMedia">
        <v-btn icon>
          <ShareNetwork
            network="facebook"
            :url="url"
            title=""
            :quote="title"
            :hashtags="tag"
          >
            <v-icon color="#3b5998" x-large>mdi-facebook</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
      <div class="socialMedia">
        <v-spacer></v-spacer>
        <v-btn icon>
          <ShareNetwork
            network="linkedin"
            :url="url"
            :title="title"
            description="check out this awesome article"
          >
            <v-icon color="#0e76a8" x-large>mdi-linkedin</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
      <v-spacer></v-spacer>

      <div class="socialMedia">
        <v-btn icon>
          <ShareNetwork
            network="whatsapp"
            :url="url"
            :title="title"
            description="check out this awesome article"
            :hashtags="tag"
          >
            <v-icon color="#4FCE5D" x-large>mdi-whatsapp</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
      <div class="socialMedia">
        <v-spacer></v-spacer>

        <v-btn icon>
          <ShareNetwork
            network="wordpress"
            :url="url"
            :title="title"
            description="check out this awesome article"
            media="check out this awesome article"
          >
            <v-icon color="#21759b" x-large>mdi-wordpress</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
      <v-spacer></v-spacer>

      <div class="socialMedia">
        <v-btn icon>
          <ShareNetwork network="reddit" :url="url" :title="title">
            <v-icon color="#FF4301" x-large>mdi-reddit</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
      <div class="socialMedia">
        <v-spacer></v-spacer>

        <v-btn icon>
          <ShareNetwork
            network="email"
            :url="url"
            :title="title"
            description="check out this awesome article"
          >
            <v-icon color="#111d5e" x-large>mdi-email</v-icon>
          </ShareNetwork>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "socialmedia",
  props: ["url", "title", "tag"],
  data: () => ({})
};
</script>

<style scoped>
.socialMedia {
  margin: 0 5px;
}
</style>
