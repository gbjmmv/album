"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_photo = require("../../stores/photo.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_load_more2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
const _easycom_uni_popup_dialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "FavoritesPage",
  setup(__props) {
    const isSelectMode = common_vendor.ref(false);
    const selectedPhotoIds = common_vendor.ref([]);
    const favoritePopup = common_vendor.ref(null);
    const photoStore = stores_photo.usePhotoStore();
    const photos = common_vendor.computed(() => photoStore.favoritePhotos);
    const isLoading = common_vendor.computed(() => photoStore.isLoading);
    common_vendor.onShow(() => {
      fetchFavorites();
    });
    common_vendor.onLoad(() => {
      fetchFavorites();
    });
    const fetchFavorites = async () => {
      await photoStore.getFavoritePhotos();
    };
    const enterSelectMode = () => {
      isSelectMode.value = true;
      selectedPhotoIds.value = [];
    };
    const cancelSelect = () => {
      isSelectMode.value = false;
      selectedPhotoIds.value = [];
    };
    const toggleSelect = (photo) => {
      const index = selectedPhotoIds.value.findIndex((id) => id === photo.id);
      if (index > -1) {
        selectedPhotoIds.value.splice(index, 1);
      } else {
        selectedPhotoIds.value.push(photo.id);
      }
    };
    const isPhotoSelected = (photo) => {
      return selectedPhotoIds.value.includes(photo.id);
    };
    const viewPhoto = (photo, index) => {
      common_vendor.index.navigateTo({
        url: `/pages/PhotoDetail/PhotoDetail?id=${photo.id}&index=${index}&source=favorites`
      });
    };
    const showDeleteConfirm = () => {
      if (!favoritePopup.value)
        return;
      favoritePopup.value.open();
    };
    const closeFavoritePopup = () => {
      if (!favoritePopup.value)
        return;
      favoritePopup.value.close();
    };
    const confirmRemoveFavorites = async () => {
      if (selectedPhotoIds.value.length === 0)
        return;
      let success = true;
      for (const photoId of selectedPhotoIds.value) {
        const result = await photoStore.toggleFavorite(photoId);
        if (!result) {
          success = false;
        }
      }
      if (success) {
        await photoStore.getFavoritePhotos();
        selectedPhotoIds.value = [];
        isSelectMode.value = false;
        common_vendor.index.showToast({
          title: "取消收藏成功",
          icon: "success"
        });
      }
      closeFavoritePopup();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: photos.value.length > 0
      }, photos.value.length > 0 ? common_vendor.e({
        b: isSelectMode.value
      }, isSelectMode.value ? {
        c: common_vendor.o(cancelSelect)
      } : {
        d: common_vendor.o(enterSelectMode)
      }, {
        e: isSelectMode.value && selectedPhotoIds.value.length > 0
      }, isSelectMode.value && selectedPhotoIds.value.length > 0 ? {
        f: common_vendor.t(selectedPhotoIds.value.length),
        g: common_vendor.o(showDeleteConfirm)
      } : {}) : {}, {
        h: photos.value.length > 0
      }, photos.value.length > 0 ? {
        i: common_vendor.f(photos.value, (photo, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(utils_url.getAvatarUrl)(photo.url)
          }, isSelectMode.value ? common_vendor.e({
            b: isPhotoSelected(photo)
          }, isPhotoSelected(photo) ? {
            c: "bf984cb0-0-" + i0,
            d: common_vendor.p({
              type: "checkbox-filled",
              size: "24",
              color: "#FFFFFF"
            })
          } : {}, {
            e: isPhotoSelected(photo) ? 1 : ""
          }) : {}, {
            f: photo.id,
            g: common_vendor.o(($event) => isSelectMode.value ? toggleSelect(photo) : viewPhoto(photo, index), photo.id)
          });
        }),
        j: isSelectMode.value
      } : {}, {
        k: !isLoading.value && photos.value.length === 0
      }, !isLoading.value && photos.value.length === 0 ? {
        l: common_assets._imports_0$1
      } : {}, {
        m: isLoading.value
      }, isLoading.value ? {
        n: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        o: common_vendor.o(confirmRemoveFavorites),
        p: common_vendor.o(closeFavoritePopup),
        q: common_vendor.p({
          type: "warning",
          title: "取消收藏",
          content: "确定要取消收藏所选照片吗？",
          ["before-close"]: true
        }),
        r: common_vendor.sr(favoritePopup, "bf984cb0-2", {
          "k": "favoritePopup"
        }),
        s: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/FavoritesPage/FavoritesPage.js.map
