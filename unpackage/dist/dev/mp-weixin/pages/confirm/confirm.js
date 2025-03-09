"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_album = require("../../stores/album.js");
const utils_url = require("../../utils/url.js");
const stores_photo = require("../../stores/photo.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "confirm",
  setup(__props) {
    const albumStore = stores_album.useAlbumStore();
    const photoStore = stores_photo.usePhotoStore();
    const albumList = common_vendor.ref([]);
    const mainAlbumId = common_vendor.index.getStorageSync("main album");
    const showIndex = common_vendor.ref(0);
    const selectedAlbumId = common_vendor.ref();
    const preselectedAlbumId = common_vendor.ref(null);
    const showAlbumSelector = common_vendor.ref(true);
    const imageAddressList = common_vendor.ref([]);
    imageAddressList.value = common_vendor.index.getStorageSync("selectedMediaFiles");
    const getAlbum = async () => {
      albumList.value = await albumStore.getAlbumList();
      if (preselectedAlbumId.value) {
        selectedAlbumId.value = preselectedAlbumId.value;
        let found = false;
        for (let i = 0; i < albumList.value.length; i++) {
          common_vendor.index.__f__("log", "at pages/confirm/confirm.vue:33", "第", i);
          common_vendor.index.__f__("log", "at pages/confirm/confirm.vue:34", "albumList.value[i].id： ", albumList.value[i].id);
          common_vendor.index.__f__("log", "at pages/confirm/confirm.vue:35", "preselectedAlbumId.value： ", preselectedAlbumId.value);
          if (albumList.value[i].id == preselectedAlbumId.value) {
            showIndex.value = i;
            found = true;
            break;
          }
        }
        common_vendor.index.__f__("log", "at pages/confirm/confirm.vue:43", found);
        if (!found) {
          selectedAlbumId.value = albumList.value[0].id;
          showIndex.value = 0;
        }
      } else {
        selectedAlbumId.value = albumList.value[0].id;
        showIndex.value = 0;
      }
      for (let i = 0; i < albumList.value.length; i++) {
        if (albumList.value[i].coverPhotoUrl) {
          albumList.value[i].coverPhotoUrl = utils_url.getAvatarUrl(albumList.value[i].coverPhotoUrl);
        } else {
          albumList.value[i].coverPhotoUrl = "/static/image/classify.png";
        }
      }
    };
    common_vendor.onLoad(async (option) => {
      if (option.albumId) {
        preselectedAlbumId.value = option.albumId;
        showAlbumSelector.value = false;
      }
      await getAlbum();
    });
    common_vendor.onShow(() => {
      if (albumStore.id_index.value && albumStore.id_index.value.id) {
        showIndex.value = albumStore.id_index.value.index;
        selectedAlbumId.value = albumStore.id_index.value.id;
      }
      if (selectedAlbumId.value) {
        for (let i = 0; i < albumList.value.length; i++) {
          if (albumList.value[i].id === selectedAlbumId.value) {
            showIndex.value = i;
            break;
          }
        }
      }
    });
    const toAlbumList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/album_list/album_list"
      });
    };
    const handleClick = () => {
      toAlbumList();
    };
    const confirmUpload = async () => {
      common_vendor.index.__f__("log", "at pages/confirm/confirm.vue:108", "selectedAlbumId.value: ", selectedAlbumId.value);
      const res = await photoStore.uploadPhotos(
        imageAddressList.value,
        selectedAlbumId.value,
        mainAlbumId
      );
      if (res) {
        common_vendor.index.showToast({ title: "上传成功", icon: "success" });
        common_vendor.index.removeStorageSync("selectedMediaFiles");
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showAlbumSelector.value
      }, showAlbumSelector.value ? {
        b: albumList.value[showIndex.value].coverPhotoUrl,
        c: common_vendor.t(albumList.value[showIndex.value].name),
        d: common_vendor.t(albumList.value[showIndex.value].number),
        e: common_vendor.o(handleClick),
        f: common_vendor.o(toAlbumList),
        g: common_vendor.p({
          type: "right",
          size: "20"
        })
      } : {}, {
        h: common_vendor.f(imageAddressList.value, (pic, index, i0) => {
          return {
            a: index,
            b: pic
          };
        }),
        i: common_vendor.o(confirmUpload)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eec36e84"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/confirm/confirm.js.map
