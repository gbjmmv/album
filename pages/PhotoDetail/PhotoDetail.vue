<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {onLoad, onShow, onUnload} from '@dcloudio/uni-app'
import {usePhotoStore} from '@/stores/photo.js'
import {getAvatarUrl} from '@/utils/url.js'

// 路由参数

//当前显示的照片id
const photoId = ref(null)
const initialIndex = ref(0) // 初始索引位置
const source = ref('album') // 默认来源为相册

// 状态
const currentIndex = ref(0) // 当前查看的照片索引

const showControls = ref(true)// 是否显示控制面板
const commentPopup = ref(null)
const deletePopup = ref(null)
const favoritePopup = ref(null)
const commentContent = ref('')
const favoriteMessage = ref({type: 'success', content: ''})
const isDragging = ref(false) // 是否正在拖拽

// 获取照片store
const photoStore = usePhotoStore()

// 根据来源选择照片数组
const photosData = computed(() => {
  if (source.value === 'favorites') {
    return photoStore.favoritePhotos
  }
  return photoStore.currentAlbumPhotos
})

// 当前显示的照片
const currentPhoto = computed(() => {
  if (photosData.value.length > 0 && currentIndex.value < photosData.value.length) {
    return photosData.value[currentIndex.value]
  }
  return {}
})


// 监视currentIndex变化，更新photoId
watch(currentIndex, (newIndex) => {
  if (photosData.value[newIndex]) {
    photoId.value = photosData.value[newIndex].id
  }
})

// 初始化
onLoad(async (option) => {
  photoId.value = option.id

  // 设置照片来源
  if (option.source) {
    source.value = option.source
  }

  if (option.index) {
    initialIndex.value = parseInt(option.index)
    currentIndex.value = initialIndex.value
  }

  // 如果是从收藏进入，确保收藏数据已加载
  if (source.value === 'favorites') {
    await photoStore.getFavoritePhotos()
  }
})

// 每次显示页面时刷新当前照片索引
onShow(() => {
  console.log('Photo detail showed')
  // 在相应照片列表中找到当前照片的索引
  if (photoId.value && photosData.value.length > 0) {
    const index = photosData.value.findIndex(photo => photo.id === parseInt(photoId.value))
    if (index > -1) {
      currentIndex.value = index
    }
  }
})

// 处理swiper切换
const handleSwiperChange = (e) => {
  currentIndex.value = e.detail.current
}


// 切换UI控制显示
const toggleControls = () => {
  showControls.value = !showControls.value
}




// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 显示评论输入框
const showCommentInput = () => {
  if (!commentPopup.value) return
  commentPopup.value.open()
}

// 关闭评论输入框
const closeCommentPopup = () => {
  if (!commentPopup.value) return
  commentPopup.value.close()
  commentContent.value = ''
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    uni.showToast({
      title: '评论内容不能为空',
      icon: 'none'
    })
    return
  }

  const success = await photoStore.addComment(currentPhoto.value.id, commentContent.value)

  if (success) {
    closeCommentPopup()
  }
}

// 切换收藏状态
const handleToggleFavorite = async () => {
  const result = await photoStore.toggleFavorite(currentPhoto.value.id)

  if (result) {
    favoriteMessage.value = {
      type: 'success',
      content: result.message || (result.isFavorite ? '收藏成功' : '取消收藏成功')
    }

    if (favoritePopup.value) {
      favoritePopup.value.open()
    }
  }
}

// 显示删除确认弹窗
const showDeleteConfirm = () => {
  if (!deletePopup.value) return
  deletePopup.value.open()
}

// 关闭删除确认弹窗
const closeDeletePopup = () => {
  if (!deletePopup.value) return
  deletePopup.value.close()
}

// 确认删除照片
const confirmDelete = async () => {
  const success = await photoStore.deletePhoto(currentPhoto.value.id)

  if (success) {
    // 删除成功后返回相册页面
    goBack()
  }

  closeDeletePopup()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 始终显示年月日和具体时间 (YYYY-MM-DD HH:MM)
  return date.getFullYear() + '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
      date.getDate().toString().padStart(2, '0') + ' ' +
      date.getHours().toString().padStart(2, '0') + ':' +
      date.getMinutes().toString().padStart(2, '0');
};
</script>

<template>
  <view class="photo-detail">
    <!-- Swiper 组件作为主要滑动容器 -->
    <swiper
        class="swiper"
        :current="currentIndex"
        @change="handleSwiperChange"
        :indicator-dots="false"
        :autoplay="false"
        :circular="false"
        :vertical="false"
        :duration="400"
        :disable-touch="false"
        easing-function="easeInOutCubic"
    >
      <swiper-item v-for="(photo, index) in photosData" :key="photo.id" class="swiper-item">
        <view class="swiper-item-content">
          <image
              :src="getAvatarUrl(photo.url)"
              mode="aspectFit"
              class="photo-image"
              @click="toggleControls"
              :style="{opacity: isDragging ? 0.7 : 1}"
          />
        </view>
      </swiper-item>
    </swiper>

    <!-- 控制面板 -->
    <view v-if="showControls" class="controls-overlay" @click="toggleControls" @touchmove.stop.prevent>
      <!-- 顶部导航栏 -->
      <view class="top-bar" @click.stop>
        <view class="page-indicator">
          <text class="page-text">{{ currentIndex + 1 }}/{{ photosData.length }}</text>
        </view>
      </view>

      <!-- 右侧操作按钮 -->
      <view class="side-action-buttons" @click.stop>
        <view class="action-button" @click="showCommentInput">
          <uni-icons type="chat" size="28" color="#FFFFFF"/>
        </view>
        <view class="action-button" @click="handleToggleFavorite">
          <uni-icons :type="currentPhoto?.isFavorite ? 'star-filled' : 'star'" size="28" color="#FFFFFF"/>
        </view>
        <view class="action-button" @click="showDeleteConfirm">
          <uni-icons type="trash" size="28" color="#FFFFFF"/>
        </view>
      </view>

      <!-- 底部评论面板 -->
      <view class="comments-panel" @click.stop>
        <!-- 评论区 -->
        <view class="comments-section">
          <view class="comments-header">
            <text class="comments-title">评论 ({{ currentPhoto?.comments?.length || 0 }})</text>
          </view>
          <scroll-view scroll-y enable-flex show-scrollbar class="comments-list">
            <view v-if="!currentPhoto?.comments || currentPhoto.comments.length === 0" class="no-comments">
              暂无评论，来添加第一条评论吧
            </view>
            <view v-else v-for="comment in currentPhoto.comments" :key="comment.id" class="comment-item">
              <view class="comment-content">{{ comment.content }}</view>
              <view class="comment-time">{{ formatDate(comment.createdAt) }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>


    <!-- 评论输入框弹窗 -->
    <uni-popup ref="commentPopup" type="bottom">
      <view class="comment-popup">
        <view class="comment-input-header">
          <text>添加评论</text>
        </view>
        <textarea
            class="comment-textarea"
            v-model="commentContent"
            placeholder="请输入评论内容..."
            maxlength="200"
            auto-height
        />
        <view class="comment-buttons">
          <button class="comment-btn cancel" @click="closeCommentPopup">取消</button>
          <button class="comment-btn confirm" @click="submitComment">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 删除确认弹窗 -->
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
          type="warning"
          title="删除照片"
          content="确定要删除当前照片吗？此操作不可撤销。"
          :before-close="true"
          @confirm="confirmDelete"
          @close="closeDeletePopup"
      />
    </uni-popup>

    <!-- 收藏提示弹窗 -->
    <uni-popup ref="favoritePopup" type="message">
      <uni-popup-message
          :type="favoriteMessage.type"
          :message="favoriteMessage.content"
          :duration="2000"
      />
    </uni-popup>
  </view>
</template>


<style>
.photo-detail {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.swiper-item-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* 确保透明部分可以穿透事件到下层 */
  pointer-events: none;
}

/* 为每个需要点击的子元素单独启用指针事件 */
.top-bar,
.side-action-buttons,
.comments-panel,
.nav-buttons {
  pointer-events: auto;
}

.top-bar {
  height: 88rpx;
  padding: 0 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-indicator {
  padding: 6rpx 16rpx;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 30rpx;
}

.page-text {
  color: white;
  font-size: 24rpx;
}

/* 导航按钮 */
.nav-buttons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  pointer-events: none;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
}

.nav-button.prev {
  left: 20rpx;
}

.nav-button.next {
  right: 20rpx;
}

/* 右侧操作按钮 */
.side-action-buttons {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.action-button {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15rpx 0;
}

/* 底部评论面板 */
.comments-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 40vh;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
  display: flex;
  flex-direction: column;
  z-index: 15;
}

.comments-section {
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
}

.comments-header {
  margin-bottom: 20rpx;
}

.comments-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.comments-list {
  max-height: calc(40vh - 80rpx);
  height: 100%;
  flex: 1;
}

.no-comments {
  padding: 30rpx 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 28rpx;
  text-align: center;
}

.comment-item {
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-user {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10rpx;
}

.comment-content {
  font-size: 30rpx;
  color: #fff;
  margin-bottom: 10rpx;
  word-break: break-all;
}

.comment-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
}

.comment-popup {
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
}

.comment-input-header {
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.comment-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  box-sizing: border-box;
  font-size: 30rpx;
}

.comment-buttons {
  display: flex;
  height: 88rpx;
  border-top: 1px solid #f0f0f0;
}

.comment-btn {
  flex: 1;
  height: 100%;
  margin: 0;
  border-radius: 0;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comment-btn.cancel {
  background-color: #f5f5f5;
  color: #666;
}

.comment-btn.confirm {
  background-color: #1890ff;
  color: #fff;
}
</style>