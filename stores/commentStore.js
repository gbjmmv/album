// src/stores/commentStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { commentApi } from '@/api/comment'
import { getAvatarUrl } from "@/utils/url"

export const useCommentStore = defineStore('comment', () => {
    // State
    const photoComments = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const hasMore = ref(true)
    const loadMoreStatus = ref('more')

    // Getters
    const isEmpty = computed(() => photoComments.value.length === 0)

    // Actions
    /**
     * 获取用户评论列表
     * @param {Boolean} refresh - 是否刷新（重置页码）
     */
    async function fetchUserComments(refresh = false) {
        if (refresh) {
            currentPage.value = 1
            photoComments.value = []
            hasMore.value = true
            loadMoreStatus.value = 'more'
        }

        if (loadMoreStatus.value === 'loading') return

        try {
            loadMoreStatus.value = 'loading'
            loading.value = currentPage.value === 1

            const response = await commentApi.getUserComments({
                page: currentPage.value,
                size: pageSize.value
            })

            if (response.code === 0) {
                const newData = response.data || []
                newData.forEach(photo => {
                    if (photo.url) {
                        photo.url = getAvatarUrl(photo.url)
                    }
                })
                console.log(newData)
                if (currentPage.value === 1) {
                    photoComments.value = newData
                } else {
                    photoComments.value = [...photoComments.value, ...newData]
                }

                // 判断是否还有更多数据
                hasMore.value = newData.length === pageSize.value
                loadMoreStatus.value = hasMore.value ? 'more' : 'noMore'
            } else {
                uni.showToast({
                    title: response.msg || '获取评论失败',
                    icon: 'none'
                })
            }
        } catch (error) {
            console.error('获取评论列表失败', error)
            uni.showToast({
                title: '网络异常，请稍后重试',
                icon: 'none'
            })
        } finally {
            loading.value = false
        }
    }

    /**
     * 加载更多评论
     */
    function loadMore() {
        if (!hasMore.value || loadMoreStatus.value === 'loading') return

        currentPage.value++
        fetchUserComments()
    }

    /**
     * 添加评论
     * @param {Object} commentData - 评论数据
     */
    async function addComment(commentData) {
        try {
            const response = await commentApi.addComment(commentData)

            if (response.code === 0) {
                uni.showToast({
                    title: '评论成功',
                    icon: 'success'
                })

                // 重新加载第一页评论
                fetchUserComments(true)
                return true
            } else {
                uni.showToast({
                    title: response.msg || '评论失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('添加评论失败', error)
            uni.showToast({
                title: '网络异常，请稍后重试',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 更新评论
     * @param {Object} commentData - 包含id和content的评论数据
     */
    async function updateComment(commentData) {
        try {
            const response = await commentApi.updateComment(commentData)

            if (response.code === 0) {
                uni.showToast({
                    title: '修改成功',
                    icon: 'success'
                })

                // 更新本地数据
                photoComments.value.forEach(photo => {
                    photo.comments.forEach(comment => {
                        if (comment.id === commentData.id) {
                            comment.content = commentData.content
                        }
                    })
                })

                return true
            } else {
                uni.showToast({
                    title: response.msg || '修改失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('修改评论失败', error)
            uni.showToast({
                title: '网络异常，请稍后重试',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 删除评论
     * @param {Object} commentData - 包含id的评论数据
     */
    async function deleteComment(commentData) {
        try {
            const response = await commentApi.deleteComment(commentData)

            if (response.code === 0) {
                uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                })

                // 更新本地数据
                photoComments.value.forEach((photo, photoIndex) => {
                    const commentIndex = photo.comments.findIndex(comment => comment.id === commentData.id)

                    if (commentIndex !== -1) {
                        photo.comments.splice(commentIndex, 1)

                        // 如果照片没有评论了，则移除整个照片项
                        if (photo.comments.length === 0) {
                            photoComments.value.splice(photoIndex, 1)
                        }
                    }
                })

                return true
            } else {
                uni.showToast({
                    title: response.msg || '删除失败',
                    icon: 'none'
                })
                return false
            }
        } catch (error) {
            console.error('删除评论失败', error)
            uni.showToast({
                title: '网络异常，请稍后重试',
                icon: 'none'
            })
            return false
        }
    }

    /**
     * 刷新评论列表
     */
    function refreshComments() {
        fetchUserComments(true)
    }

    /**
     * 重置状态
     */
    function resetState() {
        photoComments.value = []
        loading.value = false
        currentPage.value = 1
        hasMore.value = true
        loadMoreStatus.value = 'more'
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
    }
})