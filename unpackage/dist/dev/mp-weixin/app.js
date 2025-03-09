"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/user/user.js";
  "./pages/confirm/confirm.js";
  "./pages/album_list/album_list.js";
  "./pages/profile/profile.js";
  "./pages/album/album.js";
  "./pages/AlbumPage/AlbumPage.js";
  "./pages/PhotoDetail/PhotoDetail.js";
  "./pages/FavoritesPage/FavoritesPage.js";
  "./pages/other/other.js";
  "./pages/Comments/Comments.js";
  "./pages/coupon/coupon.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:5", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:8", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
