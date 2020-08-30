<template>
  <div class="home">
    <MainPage />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  components: {
    MainPage: () => import("@/components/MainPage.vue")
  },
  data() {
    return {};
  }
};
</script>
