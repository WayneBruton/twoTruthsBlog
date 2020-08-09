<template>
  <div class="about">
    <br /><br />
    <h1>This is an about page</h1>
    <!-- <template v-slot:activator="{ on, attrs }"> -->
    <!-- <v-btn
      color="primary"
      dark
      icon
      text
      @click="openClose"
    >
      <v-icon>mdi-chat</v-icon> Chat
    </v-btn> -->
    <!-- </template> -->
    <!-- <div v-if="openChat"> -->
      <!-- <chat /> -->
    <!-- </div> -->
    <h2>{{ test }}</h2>
  </div>
</template>

<script>
// import Chat from "../components/Chat";
// import DirectoryService from "../services/DirectoryServices"
export default {
  name: "about",
  data() {
    return {
      test: process.env.VUE_APP_TESTWORDS,
      openChat: false,
    };
  },
  components: {
    // Chat,
  },
  mounted() {
   
  },
  methods: {
  },
};
</script>
