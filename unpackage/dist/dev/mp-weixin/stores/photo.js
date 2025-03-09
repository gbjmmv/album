"use strict";
const common_vendor = require("../common/vendor.js");
const api_photo = require("../api/photo.js");
const usePhotoStore = common_vendor.defineStore("photo", () => {
  const currentAlbumPhotos = common_vendor.ref([]);
  const isLoading = common_vendor.ref(false);
  const favoritePhotos = common_vendor.ref([]);
  const uploadPhotos = async (filePaths, subAlbumId, mainAlbumId) => {
    if (!filePaths || filePaths.length === 0) {
      common_vendor.index.showToast({
        title: "请选择照片",
        icon: "none"
      });
      return false;
    }
    try {
      const response = await api_photo.uploadPhotosAPI(filePaths, subAlbumId, mainAlbumId);
      if (response && (Array.isArray(response) ? response[0].code === 0 : response.code === 0)) {
        common_vendor.index.showToast({
          title: "上传成功",
          icon: "success"
        });
        if (subAlbumId) {
          await getAlbumPhotos(subAlbumId);
        }
        return true;
      } else {
        common_vendor.index.showToast({
          title: Array.isArray(response) ? response[0].msg : (response == null ? void 0 : response.msg) || "上传失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:58", "上传照片失败", error);
      common_vendor.index.showToast({
        title: "上传照片失败",
        icon: "none"
      });
      return false;
    }
  };
  const getAlbumPhotos = async (subAlbumId) => {
    try {
      isLoading.value = true;
      const result = await api_photo.getAlbumPhotosDetailAPI(subAlbumId);
      if (result && result.code === 0) {
        currentAlbumPhotos.value = result.data || [];
        return result.data;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "获取照片失败",
          icon: "none"
        });
        return [];
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:87", "获取相册照片失败", error);
      common_vendor.index.showToast({
        title: "获取照片失败",
        icon: "none"
      });
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  const getPhotoDetail = async (photoId) => {
    const existingPhoto = currentAlbumPhotos.value.find((p) => p.id === parseInt(photoId));
    if (existingPhoto) {
      return existingPhoto;
    }
    try {
      isLoading.value = true;
      const result = await api_photo.getPhotoDetailAPI(photoId);
      if (result && result.code === 0) {
        return result.data;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "获取照片详情失败",
          icon: "none"
        });
        return null;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:124", "获取照片详情失败", error);
      common_vendor.index.showToast({
        title: "获取照片详情失败",
        icon: "none"
      });
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  const addComment = async (photoId, content) => {
    if (!content || content.trim() === "") {
      common_vendor.index.showToast({
        title: "评论内容不能为空",
        icon: "none"
      });
      return false;
    }
    try {
      const result = await api_photo.addCommentAPI(photoId, content);
      if (result && result.code === 0) {
        const photoIndex = currentAlbumPhotos.value.findIndex((p) => p.id === parseInt(photoId));
        if (photoIndex > -1) {
          const newComment = result.data;
          if (!currentAlbumPhotos.value[photoIndex].comments) {
            currentAlbumPhotos.value[photoIndex].comments = [];
          }
          currentAlbumPhotos.value[photoIndex].comments.unshift(newComment);
        }
        common_vendor.index.showToast({
          title: "评论成功",
          icon: "success"
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "评论失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:177", "添加评论失败", error);
      common_vendor.index.showToast({
        title: "评论失败",
        icon: "none"
      });
      return false;
    }
  };
  const toggleFavorite = async (photoId) => {
    try {
      const result = await api_photo.toggleFavoriteAPI(photoId);
      if (result && result.code === 0) {
        const photoIndex = currentAlbumPhotos.value.findIndex((p) => p.id === parseInt(photoId));
        if (photoIndex > -1) {
          currentAlbumPhotos.value[photoIndex].isFavorite = result.data.isFavorite;
        }
        return result.data;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "操作失败",
          icon: "none"
        });
        return null;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:210", "操作收藏失败", error);
      common_vendor.index.showToast({
        title: "操作失败",
        icon: "none"
      });
      return null;
    }
  };
  const deletePhoto = async (photoId) => {
    try {
      const result = await api_photo.deletePhotoAPI(photoId);
      if (result && result.code === 0) {
        currentAlbumPhotos.value = currentAlbumPhotos.value.filter((p) => p.id !== parseInt(photoId));
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "删除失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:244", "删除照片失败", error);
      common_vendor.index.showToast({
        title: "删除失败",
        icon: "none"
      });
      return false;
    }
  };
  const batchDeletePhotos = async (photoIds) => {
    if (!photoIds || photoIds.length === 0) {
      return false;
    }
    try {
      const result = await api_photo.batchDeletePhotosAPI(photoIds);
      if (result && result.code === 0) {
        currentAlbumPhotos.value = currentAlbumPhotos.value.filter((p) => !photoIds.includes(p.id));
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "删除失败",
          icon: "none"
        });
        return false;
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:282", "批量删除照片失败", error);
      common_vendor.index.showToast({
        title: "删除失败",
        icon: "none"
      });
      return false;
    }
  };
  const getFavoritePhotos = async () => {
    try {
      isLoading.value = true;
      const result = await api_photo.getFavoritePhotosAPI();
      if (result && result.code === 0) {
        favoritePhotos.value = result.data || [];
        return result.data;
      } else {
        common_vendor.index.showToast({
          title: (result == null ? void 0 : result.msg) || "获取收藏失败",
          icon: "none"
        });
        return [];
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/photo.js:309", "获取收藏照片失败", error);
      common_vendor.index.showToast({
        title: "获取收藏失败",
        icon: "none"
      });
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  return {
    currentAlbumPhotos,
    isLoading,
    favoritePhotos,
    uploadPhotos,
    getAlbumPhotos,
    getPhotoDetail,
    addComment,
    toggleFavorite,
    deletePhoto,
    batchDeletePhotos,
    getFavoritePhotos
  };
});
exports.usePhotoStore = usePhotoStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/photo.js.map
