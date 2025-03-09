"use strict";
const common_vendor = require("../common/vendor.js");
const api_album = require("../api/album.js");
const useAlbumStore = common_vendor.defineStore("album", () => {
  const id_index = common_vendor.ref({
    id: null,
    index: null
  });
  common_vendor.ref();
  const getAlbumList = async () => {
    try {
      const res = await api_album.getSubAlbums();
      common_vendor.index.__f__("log", "at stores/album.js:19", "getAlbumList收到的数据", res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/album.js:22", "获取相册信息失败:", error);
    }
  };
  const createNewAlbum = async (name) => {
    try {
      const res = await api_album.createSubAlbum(name);
      common_vendor.index.__f__("log", "at stores/album.js:30", "createNewAlbum", res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/album.js:33", "创建相册失败:", error);
    }
  };
  const updateAlbum = async (id, name) => {
    try {
      const res = await api_album.updateSubAlbum(id, name);
      common_vendor.index.__f__("log", "at stores/album.js:40", "updateSubAlbum", res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/album.js:43", "修改相册失败:", error);
    }
  };
  const deleteAlbum = async (id) => {
    try {
      const res = await api_album.deleteSubAlbum(id);
      common_vendor.index.__f__("log", "at stores/album.js:49", "updateSubAlbum", res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/album.js:52", "修改相册失败:", error);
    }
  };
  return {
    getAlbumList,
    createNewAlbum,
    updateAlbum,
    deleteAlbum,
    id_index
  };
});
exports.useAlbumStore = useAlbumStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/album.js.map
