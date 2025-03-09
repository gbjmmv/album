import {http} from '@/utils/http.js'

export const uploadPhotosAPI = (fileList, subAlbumId, mainAlbumId) => {
    const formData = {
        subAlbumId: Number(subAlbumId),
        mainAlbumId: Number(mainAlbumId)
    };

    return http.upload('/photos/upload', fileList, formData, {
        name: 'files' // 后端接收的文件字段名
    });
}

/**
 * 获取小相册下的所有照片
 * @param {Number} subAlbumId - 小相册ID
 */
export const getPhotosBySubAlbumIdAPI = (subAlbumId) => {
    return http.get(`/photos/album/${subAlbumId}`)
}
/**
 * 获取小相册下的所有照片详细信息（包括评论和收藏状态）
 * @param {Number} subAlbumId - 小相册ID
 */
export const getAlbumPhotosDetailAPI = (subAlbumId) => {
    return http.get(`/photos/album/${subAlbumId}/detail`)
}

/**
 * 获取照片详情（包括评论和收藏状态）
 * @param {Number} photoId - 照片ID
 */
export const getPhotoDetailAPI = (photoId) => {
    return http.get(`/photos/${photoId}/detail`)
}

/**
 * 添加评论
 * @param {Number} photoId - 照片ID
 * @param {String} content - 评论内容
 */
export const addCommentAPI = (photoId, content) => {
    return http.postJSON('/photos/comment', {
        photoId,
        content
    })
}

/**
 * 收藏/取消收藏照片
 * @param {Number} photoId - 照片ID
 */
export const toggleFavoriteAPI = (photoId) => {
    return http.postJSON('/photos/favorite', {
        photoId
    })
}

/**
 * 删除照片
 * @param {Number} photoId - 照片ID
 */
export const deletePhotoAPI = (photoId) => {
    return http.delete(`/photos/${photoId}`)
}

/**
 * 批量删除照片
 * @param {Array} photoIds - 照片ID数组
 */
export const batchDeletePhotosAPI = (photoIds) => {
    return http.postJSON('/photos/batch', photoIds)
}

/**
 * 获取用户收藏的照片
 */
export const getFavoritePhotosAPI = () => {
    return http.get('/photos/favorites')
}