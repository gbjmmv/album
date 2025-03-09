import {defineStore} from 'pinia'
import {ref} from 'vue'
import {
    uploadPhotosAPI,
    getPhotosBySubAlbumIdAPI,
    getAlbumPhotosDetailAPI,
    getPhotoDetailAPI,
    addCommentAPI,
    toggleFavoriteAPI,
    deletePhotoAPI,
    batchDeletePhotosAPI,
    getFavoritePhotosAPI
} from "/api/photo.js"

export const usePhotoStore = defineStore('photo', () => {

    const currentAlbumPhotos = ref([])
    const isLoading = ref(false)
    const favoritePhotos = ref([])

    /**
     * 上传照片到指定相册
     * @param {Array} filePaths - 照片本地路径数组
     * @param {Number} subAlbumId - 小相册ID
     * @param {Number} mainAlbumId - 大相册ID
     * @returns {Promise<boolean>} - 上传是否成功
     */
    const uploadPhotos = async (filePaths, subAlbumId, mainAlbumId) => {
        if (!filePaths || filePaths.length === 0) {
            uni.showToast({
                title: '请选择照片',
                icon: 'none'
            });
            return false;
        }

        try {
            // 开始上传
            const response = await uploadPhotosAPI(filePaths, subAlbumId, mainAlbumId);

            if (response && (Array.isArray(response) ? response[0].code === 0 : response.code === 0)) {
                uni.showToast({
                    title: '上传成功',
                    icon: 'success'
                });
                if (subAlbumId) {
                    await getAlbumPhotos(subAlbumId);
                }
                return true;
            } else {
                uni.showToast({
                    title: Array.isArray(response) ? response[0].msg : (response?.msg || '上传失败'),
                    icon: 'none'
                });
                return false;
            }
        } catch (error) {
            console.error('上传照片失败', error);
            uni.showToast({
                title: '上传照片失败',
                icon: 'none'
            });
            return false;
        }
    };

    /**
     * 获取相册照片列表
     * @param {Number} subAlbumId - 小相册ID
     */
    const getAlbumPhotos = async (subAlbumId) => {
        try {
            isLoading.value = true
            const result = await getAlbumPhotosDetailAPI(subAlbumId)

            if (result && result.code === 0) {
                currentAlbumPhotos.value = result.data || []
                return result.data
            } else {
                uni.showToast({
                    title: result?.msg || '获取照片失败',
                    icon: 'none'
                })
                return []
            }
        } catch (error) {
            console.error('获取相册照片失败', error)
            uni.showToast({
                title: '获取照片失败',
                icon: 'none'
            })
            return []
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 获取照片详情（如果当前相册已加载则不重新请求）
     * @param {Number} photoId - 照片ID
     */
    const getPhotoDetail = async (photoId) => {
        // 先从当前相册中查找照片
        const existingPhoto = currentAlbumPhotos.value.find(p => p.id === parseInt(photoId))
        if (existingPhoto) {
            return existingPhoto
        }

        // 如果相册中没有，则单独请求
        try {
            isLoading.value = true
            const result = await getPhotoDetailAPI(photoId)

            if (result && result.code === 0) {
                return result.data
            } else {
                uni.showToast({
                    title: result?.msg || '获取照片详情失败',
                    icon: 'none'
                })
                return null
            }
        } catch (error) {
            console.error('获取照片详情失败', error)
            uni.showToast({
                title: '获取照片详情失败',
                icon: 'none'
            })
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 添加评论
     * @param {Number} photoId - 照片ID
     * @param {String} content - 评论内容
     */
    const addComment = async (photoId, content) => {
        if (!content || content.trim() === '') {
            uni.showToast({
                title: '评论内容不能为空',
                icon: 'none'
            })
            return false
        }

        try {
            const result = await addCommentAPI(photoId, content)

            if (result && result.code === 0) {
                // 更新当前相册照片列表中的评论
                const photoIndex = currentAlbumPhotos.value.findIndex(p => p.id === parseInt(photoId))
                if (photoIndex > -1) {
                    // 添加新评论到列表开头
                    const newComment = result.data
                    if (!currentAlbumPhotos.value[photoIndex].comments) {
                        currentAlbumPhotos.value[photoIndex].comments = []
                    }
                    currentAlbumPhotos.value[photoIndex].comments.unshift(newComment)
                }

                uni.showToast({
                    title: '评论成功',
                    icon: 'success'
                })
                return true
            } else {
                uni.showToast({
                    title: result?.msg || '评论失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('添加评论失败', error)
            uni.showToast({
                title: '评论失败',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 收藏/取消收藏照片
     * @param {Number} photoId - 照片ID
     */
    const toggleFavorite = async (photoId) => {
        try {
            const result = await toggleFavoriteAPI(photoId)

            if (result && result.code === 0) {
                // 更新当前相册照片列表中的收藏状态
                const photoIndex = currentAlbumPhotos.value.findIndex(p => p.id === parseInt(photoId))
                if (photoIndex > -1) {
                    currentAlbumPhotos.value[photoIndex].isFavorite = result.data.isFavorite
                }

                return result.data
            } else {
                uni.showToast({
                    title: result?.msg || '操作失败',
                    icon: 'none'
                })
                return null
            }
        } catch (error) {
            console.error('操作收藏失败', error)
            uni.showToast({
                title: '操作失败',
                icon: 'none'
            })
            return null
        }
    }

    /**
     * 删除照片
     * @param {Number} photoId - 照片ID
     */
    const deletePhoto = async (photoId) => {
        try {
            const result = await deletePhotoAPI(photoId)

            if (result && result.code === 0) {
                // 从当前相册照片列表中移除
                currentAlbumPhotos.value = currentAlbumPhotos.value.filter(p => p.id !== parseInt(photoId))

                uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                })
                return true
            } else {
                uni.showToast({
                    title: result?.msg || '删除失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('删除照片失败', error)
            uni.showToast({
                title: '删除失败',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 批量删除照片
     * @param {Array} photoIds - 照片ID数组
     */
    const batchDeletePhotos = async (photoIds) => {
        if (!photoIds || photoIds.length === 0) {
            return false
        }

        try {
            const result = await batchDeletePhotosAPI(photoIds)

            if (result && result.code === 0) {
                // 从当前相册照片列表中移除
                currentAlbumPhotos.value = currentAlbumPhotos.value.filter(p => !photoIds.includes(p.id))

                uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                })
                return true
            } else {
                uni.showToast({
                    title: result?.msg || '删除失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('批量删除照片失败', error)
            uni.showToast({
                title: '删除失败',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 获取用户收藏的照片
     */
    const getFavoritePhotos = async () => {
        try {
            isLoading.value = true
            const result = await getFavoritePhotosAPI()
            if (result && result.code === 0) {
                favoritePhotos.value = result.data || []
                return result.data
            } else {
                uni.showToast({
                    title: result?.msg || '获取收藏失败',
                    icon: 'none'
                })
                return []
            }
        } catch (error) {
            console.error('获取收藏照片失败', error)
            uni.showToast({
                title: '获取收藏失败',
                icon: 'none'
            })
            return []
        } finally {
            isLoading.value = false
        }
    }


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