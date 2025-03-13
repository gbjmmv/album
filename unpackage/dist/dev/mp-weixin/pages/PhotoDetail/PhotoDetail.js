"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_photo = require("../../stores/photo.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _easycom_uni_popup_dialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup_message = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup + _easycom_uni_popup_dialog + _easycom_uni_popup_message)();
}
const _sfc_main = {
  __name: "PhotoDetail",
  setup(__props) {
    const photoId = common_vendor.ref(null);
    const initialIndex = common_vendor.ref(0);
    const source = common_vendor.ref("album");
    const currentIndex = common_vendor.ref(0);
    const showControls = common_vendor.ref(true);
    const commentPopup = common_vendor.ref(null);
    const deletePopup = common_vendor.ref(null);
    const favoritePopup = common_vendor.ref(null);
    const commentContent = common_vendor.ref("");
    const favoriteMessage = common_vendor.ref({ type: "success", content: "" });
    const isDragging = common_vendor.ref(false);
    const photoStore = stores_photo.usePhotoStore();
    const photosData = common_vendor.computed(() => {
      if (source.value === "favorites") {
        return photoStore.favoritePhotos;
      }
      return photoStore.currentAlbumPhotos;
    });
    const currentPhoto = common_vendor.computed(() => {
      if (photosData.value.length > 0 && currentIndex.value < photosData.value.length) {
        return photosData.value[currentIndex.value];
      }
      return {};
    });
    common_vendor.watch(currentIndex, (newIndex) => {
      if (photosData.value[newIndex]) {
        photoId.value = photosData.value[newIndex].id;
      }
    });
    common_vendor.onLoad(async (option) => {
      photoId.value = option.id;
      if (option.source) {
        source.value = option.source;
      }
      if (option.index) {
        initialIndex.value = parseInt(option.index);
        currentIndex.value = initialIndex.value;
      }
      if (source.value === "favorites") {
        await photoStore.getFavoritePhotos();
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/PhotoDetail/PhotoDetail.vue:74", "Photo detail showed");
      if (photoId.value && photosData.value.length > 0) {
        const index = photosData.value.findIndex((photo) => photo.id === parseInt(photoId.value));
        if (index > -1) {
          currentIndex.value = index;
        }
      }
    });
    const handleSwiperChange = (e) => {
      currentIndex.value = e.detail.current;
    };
    const toggleControls = () => {
      showControls.value = !showControls.value;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const showCommentInput = () => {
      if (!commentPopup.value)
        return;
      commentPopup.value.open();
    };
    const closeCommentPopup = () => {
      if (!commentPopup.value)
        return;
      commentPopup.value.close();
      commentContent.value = "";
    };
    const submitComment = async () => {
      if (!commentContent.value.trim()) {
        common_vendor.index.showToast({
          title: "评论内容不能为空",
          icon: "none"
        });
        return;
      }
      const success = await photoStore.addComment(currentPhoto.value.id, commentContent.value);
      if (success) {
        closeCommentPopup();
      }
    };
    const handleToggleFavorite = async () => {
      const result = await photoStore.toggleFavorite(currentPhoto.value.id);
      if (result) {
        favoriteMessage.value = {
          type: "success",
          content: result.message || (result.isFavorite ? "收藏成功" : "取消收藏成功")
        };
        if (favoritePopup.value) {
          favoritePopup.value.open();
        }
      }
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
      const success = await photoStore.deletePhoto(currentPhoto.value.id);
      if (success) {
        goBack();
      }
      closeDeletePopup();
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0") + " " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: common_vendor.f(photosData.value, (photo, index, i0) => {
          return {
            a: common_vendor.unref(utils_url.getAvatarUrl)(photo.url),
            b: common_vendor.o(toggleControls, photo.id),
            c: photo.id
          };
        }),
        b: isDragging.value ? 0.7 : 1,
        c: currentIndex.value,
        d: common_vendor.o(handleSwiperChange),
        e: showControls.value
      }, showControls.value ? common_vendor.e({
        f: common_vendor.t(currentIndex.value + 1),
        g: common_vendor.t(photosData.value.length),
        h: common_vendor.o(() => {
        }),
        i: common_vendor.p({
          type: "chat",
          size: "28",
          color: "#FFFFFF"
        }),
        j: common_vendor.o(showCommentInput),
        k: common_vendor.p({
          type: ((_a = currentPhoto.value) == null ? void 0 : _a.isFavorite) ? "star-filled" : "star",
          size: "28",
          color: "#FFFFFF"
        }),
        l: common_vendor.o(handleToggleFavorite),
        m: common_vendor.p({
          type: "trash",
          size: "28",
          color: "#FFFFFF"
        }),
        n: common_vendor.o(showDeleteConfirm),
        o: common_vendor.o(() => {
        }),
        p: common_vendor.t(((_c = (_b = currentPhoto.value) == null ? void 0 : _b.comments) == null ? void 0 : _c.length) || 0),
        q: !((_d = currentPhoto.value) == null ? void 0 : _d.comments) || currentPhoto.value.comments.length === 0
      }, !((_e = currentPhoto.value) == null ? void 0 : _e.comments) || currentPhoto.value.comments.length === 0 ? {} : {
        r: common_vendor.f(currentPhoto.value.comments, (comment, k0, i0) => {
          return {
            a: common_vendor.t(comment.content),
            b: common_vendor.t(formatDate(comment.createdAt)),
            c: comment.id
          };
        })
      }, {
        s: common_vendor.o(() => {
        }),
        t: common_vendor.o(toggleControls),
        v: common_vendor.o(() => {
        })
      }) : {}, {
        w: commentContent.value,
        x: common_vendor.o(($event) => commentContent.value = $event.detail.value),
        y: common_vendor.o(closeCommentPopup),
        z: common_vendor.o(submitComment),
        A: common_vendor.sr(commentPopup, "6212f8bc-3", {
          "k": "commentPopup"
        }),
        B: common_vendor.p({
          type: "bottom"
        }),
        C: common_vendor.o(confirmDelete),
        D: common_vendor.o(closeDeletePopup),
        E: common_vendor.p({
          type: "warning",
          title: "删除照片",
          content: "确定要删除当前照片吗？此操作不可撤销。",
          ["before-close"]: true
        }),
        F: common_vendor.sr(deletePopup, "6212f8bc-4", {
          "k": "deletePopup"
        }),
        G: common_vendor.p({
          type: "dialog"
        }),
        H: common_vendor.p({
          type: favoriteMessage.value.type,
          message: favoriteMessage.value.content,
          duration: 2e3
        }),
        I: common_vendor.sr(favoritePopup, "6212f8bc-6", {
          "k": "favoritePopup"
        }),
        J: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/PhotoDetail/PhotoDetail.js.map
