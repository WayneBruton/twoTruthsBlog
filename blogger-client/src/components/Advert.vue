<template>
  <div class="about">
    <v-card class="mx-auto" max-width="1000" elevation="0">
      <v-layout>
        <v-row dense>
          <v-col :cols="flex" :offset="offset" elevation="0">
            <v-card elevation="3">
              <div class="advert">
                <cld-image
                  :cloudName="cloudName"
                  :publicId="publicId"
                  class="white--text align-end"
                  loading="lazy"
                  width="100%"
                  height="200"
                  quality="auto"
                >
                  <cld-transformation aspectRatio="2.5" crop="crop" />
                  <cld-transformation
                    color="white"
                    overlay="text:arial_180:PLACE"
                    gravity="south"
                    y="250"
                  />
                </cld-image>
                <cld-image
                  :cloudName="cloudName"
                  :publicId="publicId"
                  class="white--text align-end"
                  loading="lazy"
                  width="100%"
                  height="200"
                  quality="auto"
                >
                  <cld-transformation aspectRatio="2.5" crop="crop" />
                  <cld-transformation
                    color="white"
                    overlay="text:arial_180:ADVERT"
                    gravity="south"
                    y="250"
                  />
                </cld-image>
                <cld-image
                  :cloudName="cloudName"
                  :publicId="publicId"
                  class="white--text align-end"
                  loading="lazy"
                  width="100%"
                  height="200"
                  quality="auto"
                >
                  <cld-transformation aspectRatio="2.5" crop="crop" />
                  <cld-transformation
                    color="white"
                    overlay="text:arial_180:HERE"
                    gravity="south"
                    y="250"
                  />
                </cld-image>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-layout>
      <v-card-actions> </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeOut" bottom top>
      {{ snackBarMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "advert",
  data: () => ({
    cloudName: `${process.env.VUE_APP_CLOUDNAME}`,
    preset: `${process.env.VUE_APP_PRESET}`,
    publicId: "pawel-czerwinski-_9dSF0Hwitw-unsplash.jpg"
  })
};
</script>

<style scoped>
.advert {
  display: flex;
}

@media only screen and (max-width: 768px) {
  .advert {
    flex-direction: column;
  }
}
</style>
