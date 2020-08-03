<template>
  <div class="home">
    <MainPage />
  </div>
</template>

<script>
// @ is an alias to /src
import MainPage from "@/components/MainPage.vue";

export default {
  name: "home",
  components: {
    MainPage
  },
  data() {
    return {
      test: process.env.VUE_APP_TESTWORDS
    };
  }
};
</script>
