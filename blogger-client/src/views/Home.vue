<template>
  <div class="home">
    <MainPage />
    <!-- <Chat /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import MainPage from "@/components/MainPage.vue";
// import Chat from "./components/Chat.vue";

export default {
  name: "home",
  components: {
    MainPage,
    // Chat,
  },
  data() {
    return {
      test: process.env.VUE_APP_TESTWORDS,
    };
  },
};
</script>
