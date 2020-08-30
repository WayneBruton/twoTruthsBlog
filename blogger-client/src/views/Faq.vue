<template>
  <div class="about temp">
    <v-flex
      wrap
      xs12
      md8
      sm8
      lg8
      xl8
      offset-md2
      offset-xl2
      offset-sm2
      offset-lg2
      justify="center"
    >
      <v-col cols="12" xs="12" sm="12" md="12">
        <v-row justify="center" wrap>
          <h2>Frequently asked questions</h2>
        </v-row>
      </v-col>
    </v-flex>
    <br />
    <v-flex xs12 md8 sm8 lg8 xl8 offset-md2 offset-xl2 offset-sm2 offset-lg2>
      <v-row justify="center">
        <v-expansion-panels popout dark color="grey">
          <v-expansion-panel
            v-for="(item, i) in items"
            :key="i"
            color="grey"
            dark
          >
            <v-expansion-panel-header color="#111d5e" dark class="header">{{
              item.question
            }}</v-expansion-panel-header>
            <v-expansion-panel-content
              style="background-color: white; color:black; padding-left: 15px;"
            >
              {{ item.answer }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-flex>
    <br /><br /><br />
  </div>
</template>

<script>
import DirectoryService from "../services/DirectoryServices";
export default {
  name: "faq",
  metaInfo: {
    title: "FAQ",
    titleTemplate: "Vellum - %s",
    meta: [
      {
        name: `description`,
        content: `All your questions about Vellum answered here.`
      }
    ],
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      items: []
    };
  },
  async mounted() {
    this.items = [];
    let response = await DirectoryService.getFAQ();
    this.items = response.data;
    // this.faqDialog = true;
  }
};
</script>

<style scoped>
.header {
  font-size: 105%;
}
</style>
