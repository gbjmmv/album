"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_photo = require("../../stores/photo.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_dialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _easycom_uni_load_more = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "AlbumPage",
  setup(__props) {
    const albumId = common_vendor.ref(null);
    const albumName = common_vendor.ref("");
    const isSelectMode = common_vendor.ref(false);
    const selectedPhotoIds = common_vendor.ref([]);
    const deletePopup = common_vendor.ref(null);
    const photoStore = stores_photo.usePhotoStore();
    const photos = common_vendor.computed(() => photoStore.currentAlbumPhotos);
    const isLoading = common_vendor.computed(() => photoStore.isLoading);
    common_vendor.onLoad((option) => {
      albumId.value = option.id;
      albumName.value = option.name || "相册";
    });
    common_vendor.onShow(() => {
      fetchPhotos();
    });
    const fetchPhotos = async () => {
      if (!albumId.value)
        return;
      await photoStore.getAlbumPhotos(albumId.value);
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
        url: `/pages/PhotoDetail/PhotoDetail?id=${photo.id}&index=${index}`
      });
    };
    const showDeleteConfirm = () => {
      if (!deletePopup.value)
        return;
      deletePopup.value.open();
    };
    const closeDeletePopup = () => {
      if (!deletePopup.value)
        return;
      deletePopup.value.close();
    };
    const confirmDelete = async () => {
      if (selectedPhotoIds.value.length === 0)
        return;
      const success = await photoStore.batchDeletePhotos(selectedPhotoIds.value);
      if (success) {
        selectedPhotoIds.value = [];
        isSelectMode.value = false;
      }
      closeDeletePopup();
    };
    const chooseImages = () => {
      common_vendor.index.__f__("log", "at pages/AlbumPage/AlbumPage.vue:102", "albumId.value: ", albumId.value);
      common_vendor.index.chooseImage({
        count: 9,
        sourceType: ["album"],
        success: (res) => {
          common_vendor.index.setStorageSync("selectedMediaFiles", res.tempFilePaths);
          common_vendor.index.navigateTo({
            url: `/pages/confirm/confirm?albumId=${albumId.value}`
          });
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(albumName.value),
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
      } : {}, {
        h: common_vendor.f(photos.value, (photo, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(utils_url.getAvatarUrl)(photo.url)
          }, isSelectMode.value ? common_vendor.e({
            b: isPhotoSelected(photo)
          }, isPhotoSelected(photo) ? {
            c: "64539a58-0-" + i0,
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
        i: isSelectMode.value,
        j: common_vendor.o(confirmDelete),
        k: common_vendor.o(closeDeletePopup),
        l: common_vendor.p({
          type: "warning",
          title: "删除照片",
          content: "确定要删除所选照片吗？此操作不可撤销。",
          ["before-close"]: true
        }),
        m: common_vendor.sr(deletePopup, "64539a58-1", {
          "k": "deletePopup"
        }),
        n: common_vendor.p({
          type: "dialog"
        }),
        o: !isLoading.value && photos.value.length === 0
      }, !isLoading.value && photos.value.length === 0 ? {
        p: common_assets._imports_0
      } : {}, {
        q: isLoading.value
      }, isLoading.value ? {
        r: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        s: common_vendor.p({
          type: "plus",
          size: "40",
          color: "#FFFFFF"
        }),
        t: common_vendor.o(chooseImages)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AlbumPage/AlbumPage.js.map
