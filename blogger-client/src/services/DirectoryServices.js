import Api from "@/services/Api";

export default {
  startApp(credentials) {
    // console.log(credentials)
    return Api().put(`/startApp`, credentials);
  },
  popularArticles(credentials) {
    return Api().put(`/popularArticles`, credentials);
  },
  yourInterests(credentials) {
    // console.log(credentials)
    return Api().put(`/yourInterests`, credentials);
  },
  yourLatestInterests(credentials) {
    return Api().put(`/yourLatestInterests`, credentials);
  },
  youFollowing(credentials) {
    return Api().put(`/youFollowing`, credentials);
  },
  youFollowingArticles(credentials) {
    return Api().put(`/youFollowingArticles`, credentials);
  },
  // popularArticles(credentials) {
  //   return Api().put(`/popularArticles`, credentials);
  // },
  checkEmail(credentials) {
    return Api().put(`/checkEmail`, credentials);
  },
  checkName(credentials) {
    return Api().put(`/checkName`, credentials);
  },
  createMember(credentials) {
    return Api().post(`/createMember`, credentials);
  },
  editMember(credentials) {
    return Api().put(`/editMember`, credentials);
  },
  login(credentials) {
    return Api().put(`/login`, credentials);
  },
  resetPasswordToken(credentials) {
    return Api().put(`/resetPasswordToken`, credentials);
  },
  resetPassword(credentials) {
    return Api().put(`/resetPassword`, credentials);
  },
  uploadImageInEditor(credentials) {
    return Api().post(`/uploadImageInEditor`, credentials);
  },
  removeImage(credentials) {
    return Api().post(`/removeImage`, credentials);
  },
  removeProfileImage(credentials) {
    return Api().post(`/removeProfileImage`, credentials);
  },
  getTags() {
    return Api().get(`/getTags`);
  },
  uploadArticle(credentials) {
    return Api().post(`/uploadArticle`, credentials);
  },
  saveArticle(credentials) {
    return Api().post(`/saveArticle`, credentials);
  },
  deleteEditArticle(credentials) {
    return Api().post(`/deleteEditArticle`, credentials);
  },
  uploadCoverImage(credentials) {
    return Api().post(`/uploadCoverImage`, credentials);
  },
  getArticle(credentials) {
    return Api().get(`/getArticle/${credentials}`);
  },
  recentArticles(credentials) {
    // console.log(credentials)
    return Api().put(`/recentArticles`, credentials);
  },
  authorArticles(credentials) {
    // console.log(credentials)
    return Api().put(`/authorArticles`, credentials);
  },
  searchArticles(credentials) {
    // console.log(credentials)
    return Api().put(`/searchArticles`, credentials);
  },
  getDraft(credentials) {
    return Api().get(`/getDraft/${credentials}`);
  },
  addLikes(credentials) {
    return Api().post(`/addLikes`, credentials);
  },
  updateArticleLikes(credentials) {
    return Api().post(`/updateArticleLikes`, credentials);
  },
  followingAndBookmarked(credentials) {
    return Api().put(`/followingandbookmarked`, credentials);
  },
  follow(credentials) {
    return Api().post(`/follow`, credentials);
  },
  bookMark(credentials) {
    return Api().post(`/bookMark`, credentials);
  },
  myStuff(credentials) {
    return Api().put(`/myStuff`, credentials);
  },
  removeBookmark(credentials) {
    return Api().put(`/removeBookmark`, credentials);
  },
  unfollow(credentials) {
    return Api().put(`/unfollow`, credentials);
  },
  deleteArticle(credentials) {
    return Api().put(`/deleteArticle`, credentials);
  },
  viewProfile(credentials) {
    return Api().put(`/viewProfile`, credentials);
  },
  getComments(credentials) {
    return Api().put(`/getComments`, credentials);
  },
  addComment(credentials) {
    return Api().post(`/addComment`, credentials);
  },
  addReply(credentials) {
    return Api().post(`/addReply`, credentials);
  },
  deleteComment(credentials) {
    return Api().put(`/deleteComment`, credentials);
  },
  deleteReply(credentials) {
    return Api().put(`/deleteReply`, credentials);
  },
  getHistoryLikes(credentials) {
    return Api().put(`/getHistoryLikes`, credentials);
  },
  contactForm(credentials) {
    return Api().put(`/contactForm`, credentials);
  },
  memberDetails(credentials) {
    return Api().put(`/memberDetails`, credentials);
  },
  createSignature(credentials) {
    // console.log(credentials);
    return Api().put(`/createSignature`, credentials);
  },
  processPayment(credentials) {
    // console.log(credentials);
    return Api().put(`/processPayment`, credentials);
  },
  getAdmin() {
    // console.log(credentials);
    return Api().get(`/getAdmin`);
  },
  updateAdmin(credentials) {
    // console.log(credentials);
    return Api().put(`/updateAdmin`, credentials);
  },
  getallowedViewsNonSubscriber() {
    // console.log(credentials);
    return Api().get(`/getallowedViewsNonSubscriber`);
  },
  allowedViewsNonSubscriber(credentials) {
    // console.log(credentials);
    return Api().put(`/allowedViewsNonSubscriber`, credentials);
  },
  getPaidURL(credentials) {
    // console.log(credentials);
    return Api().put(`/getPaidURL`, credentials);
  },
  checkPaidURL(credentials) {
    // console.log(credentials);
    return Api().put(`/checkPaidURL`, credentials);
  },
  getFAQ() {
    // console.log(credentials);
    return Api().get(`/getFAQ`);
  },
  addFAQ(credentials) {
    // console.log(credentials);
    return Api().post(`/addFAQ`, credentials);
  },
  deleteFAQ(credentials) {
    // console.log(credentials);
    return Api().post(`/deleteFAQ`, credentials);
  },
  editFAQ(credentials) {
    // console.log(credentials);
    return Api().put(`/editFAQ`, credentials);
  }
};
