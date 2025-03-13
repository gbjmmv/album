<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { usePhotoStore } from '@/stores/photo.js'
import { getAvatarUrl } from '@/utils/url.js'

// 获取路由参数
const albumId = ref(null)
const albumName = ref('')

const isSelectMode = ref(false)
const selectedPhotoIds = ref([])
const deletePopup = ref(null)

// 获取照片store
const photoStore = usePhotoStore()
const photos = computed(() => photoStore.currentAlbumPhotos)
const isLoading = computed(() => photoStore.isLoading)

// 从路由获取小相册ID
onLoad((option) => {
  albumId.value = option.id
  albumName.value = option.name || '相册'
})

// 每次显示页面时刷新数据
onShow(() => {
  fetchPhotos()
})

// 加载相册照片
const fetchPhotos = async () => {
  if (!albumId.value) return
  await photoStore.getAlbumPhotos(albumId.value)
}

// 进入照片选择模式
const enterSelectMode = () => {
  isSelectMode.value = true
  selectedPhotoIds.value = []
}

// 取消选择模式
const cancelSelect = () => {
  isSelectMode.value = false
  selectedPhotoIds.value = []
}

// 切换照片选择状态
const toggleSelect = (photo) => {
  const index = selectedPhotoIds.value.findIndex(id => id === photo.id)
  if (index > -1) {
    selectedPhotoIds.value.splice(index, 1)
  } else {
    selectedPhotoIds.value.push(photo.id)
  }
}

// 判断照片是否已选中
const isPhotoSelected = (photo) => {
  return selectedPhotoIds.value.includes(photo.id)
}

// 查看照片
const viewPhoto = (photo, index) => {
  // 导航到照片详情页，传递照片ID和当前相册中的照片列表索引
  uni.navigateTo({
    url: `/pages/PhotoDetail/PhotoDetail?id=${photo.id}&index=${index}`
  })
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

// 确认删除选中照片
const confirmDelete = async () => {
  if (selectedPhotoIds.value.length === 0) return

  const success = await photoStore.batchDeletePhotos(selectedPhotoIds.value)

  if (success) {
    // 清空选中照片
    selectedPhotoIds.value = []
    // 退出选择模式
    isSelectMode.value = false
  }

  closeDeletePopup()
}

// 选择并上传图片到当前相册
const chooseImages = () => {
  console.log("albumId.value: ",albumId.value)
  uni.chooseImage({
    count: 9,
    sourceType: ['album'],
    success: (res) => {
      // 处理选择的图片
      uni.setStorageSync('selectedMediaFiles', res.tempFilePaths);
      // 传递相册ID到确认页面
      uni.navigateTo({
        url: `/pages/confirm/confirm?albumId=${albumId.value}`
      });
    },
    fail: (err) => {
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  });
}
</script>

<template>
  <view class="album-page">
    <view class="header">
      <view class="title">{{ albumName }}</view>
      <view class="actions">
        <button v-if="isSelectMode" @click="cancelSelect" class="cancel-btn">取消</button>
        <button v-else @click="enterSelectMode" class="select-btn">选择</button>
        <button v-if="isSelectMode && selectedPhotoIds.length > 0" @click="showDeleteConfirm" class="delete-btn">删除({{ selectedPhotoIds.length }})</button>
      </view>
    </view>

    <view class="photos-grid">
      <view
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="photo-item"
          @click="isSelectMode ? toggleSelect(photo) : viewPhoto(photo, index)"
      >
        <image :src="getAvatarUrl(photo.url)" mode="aspectFill" class="photo-image" />
        <view v-if="isSelectMode" class="select-overlay" :class="{ selected: isPhotoSelected(photo) }">
          <uni-icons v-if="isPhotoSelected(photo)" type="checkbox-filled" size="24" color="#FFFFFF" />
        </view>
      </view>
    </view>

    <!-- 删除确认弹窗 -->
    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
          type="warning"
          title="删除照片"
          content="确定要删除所选照片吗？此操作不可撤销。"
          :before-close="true"
          @confirm="confirmDelete"
          @close="closeDeletePopup"
      />
    </uni-popup>

    <!-- 空状态提示 -->
    <view v-if="!isLoading && photos.length === 0" class="empty-state">
      <image src="/static/images/empty-album.png" mode="aspectFit" class="empty-image" />
      <text class="empty-text">相册里还没有照片</text>
    </view>

    <!-- 加载状态 -->
    <uni-load-more v-if="isLoading" status="loading" />

    <!-- 添加悬浮的上传按钮 -->
    <view class="floating-button" @click="chooseImages">
      <uni-icons type="plus" size="40" color="#FFFFFF" />
    </view>
  </view>
</template>



<style>
.album-page {
  padding: 20rpx;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.select-btn, .cancel-btn, .delete-btn {
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1); /* 添加轻微的阴影 */
  transition: all 0.2s ease; /* 添加过渡效果 */
}

.select-btn {
  background-color: #f8f8f8;
  color: #333;
}


.cancel-btn {
  background-color: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background-color: #d9d9d9; /* 鼠标悬停时背景色变深 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15); /* 悬停时阴影加深 */
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
}

.delete-btn:hover {
  background-color: #ff1a1d; /* 鼠标悬停时背景色变深 */
  box-shadow: 0 4rpx 8rpx rgba(255, 77, 79, 0.3); /* 悬停时阴影加深 */
}


.photos-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -5rpx;
}

.photo-item {
  position: relative;
  width: calc(33.333% - 10rpx);
  padding-bottom: calc(33.333% - 10rpx);
  margin: 5rpx;
  overflow: hidden;
}

.photo-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-overlay.selected {
  background-color: rgba(0, 0, 0, 0.5);
  border: 4rpx solid #1890ff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

/* 悬浮上传按钮样式 */
.floating-button {
  position: fixed;
  right: 80rpx;
  bottom: 120rpx;
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background-color: #28b389;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(40, 179, 137, 0.4);
  z-index: 100;
  transition: all 0.3s ease;
}

.floating-button:active {
  transform: scale(0.8);
  box-shadow: 0 2rpx 8rpx rgba(40, 179, 137, 0.3);
}
</style>