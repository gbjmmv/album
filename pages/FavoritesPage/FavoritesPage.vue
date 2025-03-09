<script setup>
import { ref, computed, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { usePhotoStore } from '@/stores/photo';
import { getAvatarUrl } from '@/utils/url.js';

// 状态
const isSelectMode = ref(false);
const selectedPhotoIds = ref([]);
const favoritePopup = ref(null);
// 获取照片store
const photoStore = usePhotoStore();
const photos = computed(() =>photoStore.favoritePhotos);
const isLoading = computed(() => photoStore.isLoading);

// 每次显示页面时刷新数据
onShow(() => {
  fetchFavorites();
});

onLoad(()=>{
  fetchFavorites();
})

// 加载收藏的照片
const fetchFavorites = async () => {
  await photoStore.getFavoritePhotos();
};

// 进入照片选择模式
const enterSelectMode = () => {
  isSelectMode.value = true;
  selectedPhotoIds.value = [];
};

// 取消选择模式
const cancelSelect = () => {
  isSelectMode.value = false;
  selectedPhotoIds.value = [];
};

// 切换照片选择状态
const toggleSelect = (photo) => {
  const index = selectedPhotoIds.value.findIndex(id => id === photo.id);
  if (index > -1) {
    selectedPhotoIds.value.splice(index, 1);
  } else {
    selectedPhotoIds.value.push(photo.id);
  }
};

// 判断照片是否已选中
const isPhotoSelected = (photo) => {
  return selectedPhotoIds.value.includes(photo.id);
};

// 查看照片
const viewPhoto = (photo, index) => {
  // 导航到照片详情页，传递照片ID和当前照片列表索引
  // 特殊处理：传递source=favorites表示来源是收藏页面
  uni.navigateTo({
    url: `/pages/PhotoDetail/PhotoDetail?id=${photo.id}&index=${index}&source=favorites`
  });
};

// 显示取消收藏确认弹窗
const showDeleteConfirm = () => {
  if (!favoritePopup.value) return;
  favoritePopup.value.open();
};

// 关闭取消收藏确认弹窗
const closeFavoritePopup = () => {
  if (!favoritePopup.value) return;
  favoritePopup.value.close();
};

// 确认取消收藏选中照片
const confirmRemoveFavorites = async () => {
  if (selectedPhotoIds.value.length === 0) return;

  let success = true;
  for (const photoId of selectedPhotoIds.value) {
    const result = await photoStore.toggleFavorite(photoId);
    if (!result) {
      success = false;
    }
  }

  if (success) {
    // 刷新收藏列表
    await photoStore.getFavoritePhotos();

    // 清空选中照片
    selectedPhotoIds.value = [];
    // 退出选择模式
    isSelectMode.value = false;

    uni.showToast({
      title: '取消收藏成功',
      icon: 'success'
    });
  }

  closeFavoritePopup();
};
</script>


<template>
  <view class="favorites-page">
    <view class="header">
      <view class="title">我的收藏</view>
      <view class="actions" v-if="photos.length > 0">
        <button v-if="isSelectMode" @click="cancelSelect" class="cancel-btn">取消</button>
        <button v-else @click="enterSelectMode" class="select-btn">选择</button>
        <button v-if="isSelectMode && selectedPhotoIds.length > 0" @click="showDeleteConfirm" class="delete-btn">取消收藏({{ selectedPhotoIds.length }})</button>
      </view>
    </view>

    <view class="photos-grid" v-if="photos.length > 0">
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

    <!-- 空状态提示 -->
    <view v-if="!isLoading && photos.length === 0" class="empty-state">
      <image src="/static/images/empty-favorites.png" mode="aspectFit" class="empty-image" />
      <text class="empty-text">暂无收藏的照片</text>
      <text class="empty-subtext">浏览相册时点击收藏按钮即可收藏照片</text>
    </view>

    <!-- 加载状态 -->
    <uni-load-more v-if="isLoading" status="loading" />

    <!-- 删除确认弹窗 -->
    <uni-popup ref="favoritePopup" type="dialog">
      <uni-popup-dialog
          type="warning"
          title="取消收藏"
          content="确定要取消收藏所选照片吗？"
          :before-close="true"
          @confirm="confirmRemoveFavorites"
          @close="closeFavoritePopup"
      />
    </uni-popup>
  </view>
</template>



<style>
.favorites-page {
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

.select-btn:hover {
  background-color: #e0e0e0; /* 鼠标悬停时背景色变深 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15); /* 悬停时阴影加深 */
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
  color: #666;
  font-size: 32rpx;
  margin-bottom: 10rpx;
}

.empty-subtext {
  color: #999;
  font-size: 26rpx;
}
</style>
