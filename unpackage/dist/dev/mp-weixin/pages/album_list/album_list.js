"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_album = require("../../stores/album.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "album_list",
  setup(__props) {
    const albumStore = stores_album.useAlbumStore();
    const albumList = common_vendor.ref([]);
    const getAlbum = async () => {
      albumList.value = await albumStore.getAlbumList();
      for (let i = 0; i < albumList.value.length; i++) {
        if (albumList.value[i].coverPhotoUrl) {
          albumList.value[i].coverPhotoUrl = utils_url.getAvatarUrl(albumList.value[i].coverPhotoUrl);
        } else {
          albumList.value[i].coverPhotoUrl = "/static/image/classify.png";
        }
      }
    };
    common_vendor.onLoad(async () => {
      common_vendor.index.__f__("log", "at pages/album_list/album_list.vue:21", "触发onLoad");
      await getAlbum();
    });
    const inputValue = common_vendor.ref("");
    const choose = (id, index) => {
      albumStore.id_index.value = {
        id,
        index
      };
      common_vendor.index.navigateBack();
    };
    const show = common_vendor.ref(false);
    function createNewAlbum() {
      show.value = true;
    }
    function cancelNewAlbum() {
      show.value = false;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(albumList.value, (item, index, i0) => {
          return {
            a: albumList.value[index].coverPhotoUrl,
            b: common_vendor.t(albumList.value[index].name),
            c: common_vendor.t(albumList.value[index].number),
            d: common_vendor.o(($event) => choose(item.id, index), item.id),
            e: item.id
          };
        }),
        b: common_vendor.o(createNewAlbum),
        c: common_vendor.p({
          color: "#28b389",
          type: "plus",
          size: "60"
        }),
        d: inputValue.value,
        e: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        f: common_vendor.o(cancelNewAlbum),
        g: show.value
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/album_list/album_list.js.map
