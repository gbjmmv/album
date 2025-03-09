"use strict";
const utils_http = require("../utils/http.js");
const uploadPhotosAPI = (fileList, subAlbumId, mainAlbumId) => {
  const formData = {
    subAlbumId: Number(subAlbumId),
    mainAlbumId: Number(mainAlbumId)
  };
  return utils_http.http.upload("/photos/upload", fileList, formData, {
    name: "files"
    // 后端接收的文件字段名
  });
};
const getAlbumPhotosDetailAPI = (subAlbumId) => {
  return utils_http.http.get(`/photos/album/${subAlbumId}/detail`);
};
const getPhotoDetailAPI = (photoId) => {
  return utils_http.http.get(`/photos/${photoId}/detail`);
};
const addCommentAPI = (photoId, content) => {
  return utils_http.http.postJSON("/photos/comment", {
    photoId,
    content
  });
};
const toggleFavoriteAPI = (photoId) => {
  return utils_http.http.postJSON("/photos/favorite", {
    photoId
  });
};
const deletePhotoAPI = (photoId) => {
  return utils_http.http.delete(`/photos/${photoId}`);
};
const batchDeletePhotosAPI = (photoIds) => {
  return utils_http.http.postJSON("/photos/batch", photoIds);
};
const getFavoritePhotosAPI = () => {
  return utils_http.http.get("/photos/favorites");
};
exports.addCommentAPI = addCommentAPI;
exports.batchDeletePhotosAPI = batchDeletePhotosAPI;
exports.deletePhotoAPI = deletePhotoAPI;
exports.getAlbumPhotosDetailAPI = getAlbumPhotosDetailAPI;
exports.getFavoritePhotosAPI = getFavoritePhotosAPI;
exports.getPhotoDetailAPI = getPhotoDetailAPI;
exports.toggleFavoriteAPI = toggleFavoriteAPI;
exports.uploadPhotosAPI = uploadPhotosAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/photo.js.map
