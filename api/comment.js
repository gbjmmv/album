// src/api/comment.js
import { http } from '@/utils/http.js'

/**
 * 评论相关API封装
 */
export const commentApi = {
    /**
     * 获取用户的评论列表
     * @param {Object} params - 分页参数
     * @returns {Promise} - 评论列表请求结果
     */
    getUserComments(params = { page: 1, size: 10 }) {
        return http.get('/comment/list', params)
    },

    /**
     * 添加评论
     * @param {Object} data - 评论数据，包含photoId和content
     * @returns {Promise} - 添加评论请求结果
     */
    addComment(data) {
        return http.postJSON('/comment/add', data)
    },

    /**
     * 更新评论
     * @param {Object} data - 评论数据，包含id和content
     * @returns {Promise} - 更新评论请求结果
     */
    updateComment(data) {
        return http.postJSON('/comment/update', data)
    },

    /**
     * 删除评论
     * @param {Object} data - 包含要删除的评论id
     * @returns {Promise} - 删除评论请求结果
     */
    deleteComment(data) {
        return http.postJSON('/comment/delete', data)
    }
}