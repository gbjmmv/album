<script setup>
import {ref, reactive} from 'vue'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {useAlbumStore} from '@/stores/album.js'
import {getAvatarUrl} from '@/utils/url.js'

const albumStore = useAlbumStore()
const albumList = ref([])
const options = reactive([
  {
    text: '编辑',
    style: {
      backgroundColor: '#007aff'
    }
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#dd524d'
    }
  }
]);


const showCreateDialog = ref(false);
const albumName = ref('');

const openCreateDialog = () => {
  albumName.value = '';
  showCreateDialog.value = true;

};

const closeCreateDialog = () => {
  showCreateDialog.value = false;
};

// 编辑相册相关
const showEditDialog = ref(false);
const editAlbumName = ref('');
const currentEditId = ref(null);

const getAlbum = async () => {
  albumList.value = await albumStore.getAlbumList()
  for(let i=0; i<albumList.value.length; i++) {
    if(albumList.value[i].coverPhotoUrl){
      albumList.value[i].coverPhotoUrl = getAvatarUrl(albumList.value[i].coverPhotoUrl)
    } else {
      albumList.value[i].coverPhotoUrl = "/static/image/classify.png"
    }
  }
}

onLoad(async ()=>{
  await getAlbum()
})
onShow(async ()=>{
  await getAlbum()
})

const confirmCreate = async() => {
  if (albumName.value.trim()) {
    await albumStore.createNewAlbum(albumName.value)
    console.log('创建新相册:', albumName.value);

    // 关闭弹窗
    closeCreateDialog();
    // 重新获取相册列表
    await getAlbum();
  } else {
    // 提示用户输入相册名称
    uni.showToast({
      title: '请输入相册名称',
      icon: 'none'
    });
  }
};

const confirmEdit = async() => {
  if (editAlbumName.value.trim()) {
    // 只传递id和name两个参数给后端方法
    await albumStore.updateAlbum(currentEditId.value, editAlbumName.value)
    console.log('更新相册 - ID:', currentEditId.value, '新名称:', editAlbumName.value);

    // 关闭弹窗
    closeEditDialog();
    // 重新获取相册列表
    await getAlbum();
  } else {
    // 提示用户输入相册名称
    uni.showToast({
      title: '请输入相册名称',
      icon: 'none'
    });
  }
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  currentEditId.value = null;
};

const handleClick = (album) => {
  console.log('点击相册:', album);
  uni.navigateTo({
    url: `/pages/AlbumPage/AlbumPage?id=${album.id}&name=${encodeURIComponent(album.name)}`
  });
}

const handleSwipeClick = (e, item, index) => {
  console.log(e)
  // 0是(编辑)，1是(删除)
  if (e.index === 0) {
    handleEdit(item.id, item.name);
  } else if (e.index === 1) {
    handleDelete(item, index);
  }
};

const handleEdit = (id, name) => {
  console.log('编辑相册：id=' + id + ', name=' + name);
  // 设置当前编辑的相册ID和名称
  currentEditId.value = id;
  editAlbumName.value = name;
  // 显示编辑弹窗
  showEditDialog.value = true;
};

// 删除方法
const handleDelete = (item) => {
  console.log('删除相册：', item);
  // 实现你的删除逻辑
  uni.showModal({
    title: '提示',
    content: '确定要删除该相册吗？',
    success: async (res) => {
      if (res.confirm) {
        // 确认删除
        await albumStore.deleteAlbum(item.id);
        // 重新获取相册列表
        await getAlbum();
      }
    }
  });
};
</script>

<template>
  <view class="album-container">
    <!-- 相册列表 -->
    <view class="album-list">
      <view class="album-item-wrapper" v-for="(subAlbum, index) in albumList" :key="subAlbum.id">
        <uni-swipe-action>
          <uni-swipe-action-item :right-options="options" @click="handleSwipeClick($event, subAlbum, index)">
            <view class="album-item" @click="handleClick(subAlbum)">
              <view class="album-info">
                <view class="album-name">{{ subAlbum.name }}</view>
                <view class="album-count">{{ subAlbum.number }}张</view>
              </view>
              <view class="album-cover">
                <image :src="subAlbum.coverPhotoUrl" mode="aspectFill"></image>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </view>

    <!-- 新建相册按钮 -->
    <view class="create-album">
      <view class="create-text">新建相册</view>
      <uni-icons @click="openCreateDialog" class="create-icon" color="#28b389" type="plus" size="60"></uni-icons>
    </view>

    <!-- 创建相册弹窗 -->
    <view class="dialog-overlay" v-if="showCreateDialog" @click="closeCreateDialog">
      <view class="dialog-content" @click.stop>
<!--        方式事件冒泡-->
        <view class="dialog-header">
          <text class="dialog-title">创建新相册</text>
        </view>

        <view class="dialog-body">
          <input
              class="album-input"
              type="text"
              v-model="albumName"
              placeholder="请输入相册名称"
              maxlength="20"
          />
        </view>

        <view class="dialog-footer">
          <button class="btn btn-cancel" @click="closeCreateDialog">取消</button>
          <button class="btn btn-confirm" @click="confirmCreate">确定</button>
        </view>
      </view>
    </view>

    <!-- 编辑相册弹窗 -->
    <view class="dialog-overlay" v-if="showEditDialog" @click.stop="closeEditDialog">
      <view class="dialog-content" @click.stop>
        <view class="dialog-header">
          <text class="dialog-title">编辑相册</text>
        </view>

        <view class="dialog-body">
          <input
              class="album-input"
              type="text"
              v-model="editAlbumName"
              placeholder="请输入新的相册名称"
              maxlength="20"
          />
        </view>

        <view class="dialog-footer">
          <button class="btn btn-cancel" @click="closeEditDialog">取消</button>
          <button class="btn btn-confirm" @click="confirmEdit">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>


<style>
/* 页面整体容器 */
.album-container {
  padding: 20rpx;
  height: 100%;
  box-sizing: border-box;
}

/* 相册列表样式 */
.album-list {
  width: 100%;
}

.album-item-wrapper {
  margin-bottom: 20rpx;
  width: 100%;
}

/* 相册条目样式 */
.album-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx 30rpx;
  border-radius: 12rpx;
  height: 140rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 相册信息区域（名称和数量） */
.album-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20rpx;
  flex: 1;
}

.album-name {
  font-size: 34rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 8rpx;
  text-align: left;
}

.album-count {
  font-size: 26rpx;
  color: #999999;
  text-align: left;
}

/* 相册封面 */
.album-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.album-cover image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 新建相册按钮区域 */
.create-album {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 40rpx;
  padding-right: 20rpx;
}

.create-text {
  font-size: 32rpx;
  color: #333333;
  margin-right: 20rpx;
}

.create-icon {
  line-height: 1;
}

/* 弹窗样式 */
.dialog-overlay {

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-content {
  width: 80%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.dialog-header {
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
}

.dialog-body {
  padding: 30rpx;
}

.album-input {
  width: 100%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.dialog-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.btn {
  flex: 1;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 30rpx;
  border: none;
  background-color: transparent;
}

.btn-cancel {
  color: #666666;
  border-right: 1rpx solid #f0f0f0;
}

.btn-confirm {
  color: #28b389;
  font-weight: 500;
}
</style>