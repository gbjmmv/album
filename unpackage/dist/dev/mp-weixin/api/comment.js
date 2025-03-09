"use strict";
const utils_http = require("../utils/http.js");
const commentApi = {
  /**
   * 获取用户的评论列表
   * @param {Object} params - 分页参数
   * @returns {Promise} - 评论列表请求结果
   */
  getUserComments(params = { page: 1, size: 10 }) {
    return utils_http.http.get("/comment/list", params);
  },
  /**
   * 添加评论
   * @param {Object} data - 评论数据，包含photoId和content
   * @returns {Promise} - 添加评论请求结果
   */
  addComment(data) {
    return utils_http.http.postJSON("/comment/add", data);
  },
  /**
   * 更新评论
   * @param {Object} data - 评论数据，包含id和content
   * @returns {Promise} - 更新评论请求结果
   */
  updateComment(data) {
    return utils_http.http.postJSON("/comment/update", data);
  },
  /**
   * 删除评论
   * @param {Object} data - 包含要删除的评论id
   * @returns {Promise} - 删除评论请求结果
   */
  deleteComment(data) {
    return utils_http.http.postJSON("/comment/delete", data);
  }
};
exports.commentApi = commentApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/comment.js.map
