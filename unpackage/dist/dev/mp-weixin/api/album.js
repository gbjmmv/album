"use strict";
const utils_http = require("../utils/http.js");
function createSubAlbum(name) {
  return utils_http.http.postForm("/sub-albums", { name });
}
function deleteSubAlbum(id) {
  return utils_http.http.delete(`/sub-albums/${id}`);
}
function updateSubAlbum(id, name) {
  return utils_http.http.put(`/sub-albums/${id}?name=${encodeURIComponent(name)}`);
}
function getSubAlbums() {
  return utils_http.http.get("/sub-albums/list");
}
exports.createSubAlbum = createSubAlbum;
exports.deleteSubAlbum = deleteSubAlbum;
exports.getSubAlbums = getSubAlbums;
exports.updateSubAlbum = updateSubAlbum;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/album.js.map
