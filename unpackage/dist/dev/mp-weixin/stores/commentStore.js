"use strict";
const common_vendor = require("../common/vendor.js");
const api_comment = require("../api/comment.js");
const utils_url = require("../utils/url.js");
const useCommentStore = common_vendor.defineStore("comment", () => {
  const photoComments = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const currentPage = common_vendor.ref(1);
  const pageSize = common_vendor.ref(10);
  const hasMore = common_vendor.ref(true);
  const loadMoreStatus = common_vendor.ref("more");
  const isEmpty = common_vendor.computed(() => photoComments.value.length === 0);
  async function fetchUserComments(refresh = false) {
    if (refresh) {
      currentPage.value = 1;
      photoComments.value = [];
      hasMore.value = true;
      loadMoreStatus.value = "more";
    }
    if (loadMoreStatus.value === "loading")
      return;
    try {
      loadMoreStatus.value = "loading";
      loading.value = currentPage.value === 1;
      const response = await api_comment.commentApi.getUserComments({
        page: currentPage.value,
        size: pageSize.value
      });
      if (response.code === 0) {
        const newData = response.data || [];
        newData.forEach((photo) => {
          if (photo.url) {
            photo.url = utils_url.getAvatarUrl(photo.url);
          }
        });
        common_vendor.index.__f__("log", "at stores/commentStore.js:50", newData);
        if (currentPage.value === 1) {
          photoComments.value = newData;
        } else {
          photoComments.value = [...photoComments.value, ...newData];
        }
        hasMore.value = newData.length === pageSize.value;
        loadMoreStatus.value = hasMore.value ? "more" : "noMore";
      } else {
        common_vendor.index.showToast({
          title: response.msg || "获取评论失败",
          icon: "none"
        });
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/commentStore.js:67", "获取评论列表失败", error);
      common_vendor.index.showToast({
        title: "网络异常，请稍后重试",
        icon: "none"
      });
    } finally {
      loading.value = false;
    }
  }
  function loadMore() {
    if (!hasMore.value || loadMoreStatus.value === "loading")
      return;
    currentPage.value++;
    fetchUserComments();
  }
  async function addComment(commentData) {
    try {
      const response = await api_comment.commentApi.addComment(commentData);
      if (response.code === 0) {
        common_vendor.index.showToast({
          title: "评论成功",
          icon: "success"
        });
        fetchUserComments(true);
        return true;
      } else {
        common_vendor.index.showToast({
          title: response.msg || "评论失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/commentStore.js:112", "添加评论失败", error);
      common_vendor.index.showToast({
        title: "网络异常，请稍后重试",
        icon: "none"
      });
      return false;
    }
  }
  async function updateComment(commentData) {
    try {
      const response = await api_comment.commentApi.updateComment(commentData);
      if (response.code === 0) {
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
        photoComments.value.forEach((photo) => {
          photo.comments.forEach((comment) => {
            if (comment.id === commentData.id) {
              comment.content = commentData.content;
            }
          });
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: response.msg || "修改失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/commentStore.js:153", "修改评论失败", error);
      common_vendor.index.showToast({
        title: "网络异常，请稍后重试",
        icon: "none"
      });
      return false;
    }
  }
  async function deleteComment(commentData) {
    try {
      const response = await api_comment.commentApi.deleteComment(commentData);
      if (response.code === 0) {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        photoComments.value.forEach((photo, photoIndex) => {
          const commentIndex = photo.comments.findIndex((comment) => comment.id === commentData.id);
          if (commentIndex !== -1) {
            photo.comments.splice(commentIndex, 1);
            if (photo.comments.length === 0) {
              photoComments.value.splice(photoIndex, 1);
            }
          }
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: response.msg || "删除失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/commentStore.js:199", "删除评论失败", error);
      common_vendor.index.showToast({
        title: "网络异常，请稍后重试",
        icon: "none"
      });
      return false;
    }
  }
  function refreshComments() {
    fetchUserComments(true);
  }
  function resetState() {
    photoComments.value = [];
    loading.value = false;
    currentPage.value = 1;
    hasMore.value = true;
    loadMoreStatus.value = "more";
  }
  return {
    // State
    photoComments,
    loading,
    currentPage,
    pageSize,
    hasMore,
    loadMoreStatus,
    // Getters
    isEmpty,
    // Actions
    fetchUserComments,
    loadMore,
    addComment,
    updateComment,
    deleteComment,
    refreshComments,
    resetState
  };
});
exports.useCommentStore = useCommentStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/commentStore.js.map
