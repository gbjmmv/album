<script setup>
import {ref, watch} from 'vue';
import {onShow, onLoad} from '@dcloudio/uni-app'
import {useAlbumStore} from '@/stores/album.js'
import {getAvatarUrl} from "@/utils/url";
import {usePhotoStore} from '@/stores/photo.js'

const albumStore = useAlbumStore()
const photoStore = usePhotoStore()
const albumList = ref([])
const mainAlbumId = uni.getStorageSync('main album')
const showIndex = ref(0)

// 读取缓存的相册id和路由传递的相册id
const selectedAlbumId = ref();
const preselectedAlbumId = ref(null);
// 是否显示选择相册部分
const showAlbumSelector = ref(true);

// 用户选择的图片
const imageAddressList = ref([])
imageAddressList.value = uni.getStorageSync('selectedMediaFiles')

const getAlbum = async () => {
  albumList.value = await albumStore.getAlbumList()

  // 如果有预选的相册ID，则选择该相册
  if (preselectedAlbumId.value) {
    selectedAlbumId.value = preselectedAlbumId.value
    // 找到预选相册的索引
    let found = false
    for (let i = 0; i < albumList.value.length; i++) {
      console.log("第",i)
      console.log("albumList.value[i].id： ",albumList.value[i].id)
      console.log("preselectedAlbumId.value： ",preselectedAlbumId.value)

      if (albumList.value[i].id == preselectedAlbumId.value) {
        showIndex.value = i
        found = true
        break
      }
    }
    console.log(found)

    // 如果没找到匹配的相册，为安全起见也设置默认值
    if (!found) {
      selectedAlbumId.value = albumList.value[0].id
      showIndex.value = 0
    }
  } else {
    // 否则默认选择第一个相册
    selectedAlbumId.value = albumList.value[0].id
    showIndex.value = 0
  }

  // 处理相册封面
  for (let i = 0; i < albumList.value.length; i++) {
    if (albumList.value[i].coverPhotoUrl) {
      albumList.value[i].coverPhotoUrl = getAvatarUrl(albumList.value[i].coverPhotoUrl)
    } else {
      albumList.value[i].coverPhotoUrl = "/static/image/classify.png"
    }
  }
}

onLoad(async (option) => {
  // 获取路由参数中的相册ID
  if (option.albumId) {
    preselectedAlbumId.value = option.albumId
    // 如果是从相册页面进入，不显示选择相册部分
    showAlbumSelector.value = false
  }

  await getAlbum()
})

onShow(() => {
  // 如果从相册列表页面返回，更新选中的相册
  if (albumStore.id_index.value && albumStore.id_index.value.id) {
    showIndex.value = albumStore.id_index.value.index
    selectedAlbumId.value = albumStore.id_index.value.id
  }

  // 确保界面显示正确的相册
  if (selectedAlbumId.value) {
    for (let i = 0; i < albumList.value.length; i++) {
      if (albumList.value[i].id === selectedAlbumId.value) {
        showIndex.value = i
        break
      }
    }
  }
});

const toAlbumList = () => {
  uni.navigateTo({
    url: '/pages/album_list/album_list'
  });
}

const handleClick = () => {
  // 处理点击相册的事件
  toAlbumList()
}


const confirmUpload = async () => {
  console.log("selectedAlbumId.value: ",selectedAlbumId.value)
  const res = await photoStore.uploadPhotos(
      imageAddressList.value,
      selectedAlbumId.value,
      mainAlbumId
  )
  if (res) {
    uni.showToast({ title: '上传成功', icon: 'success' });
    uni.removeStorageSync('selectedMediaFiles'); // 清空已选照片缓存
    uni.navigateBack();
  }
}
</script>
<template>
  <view class="confirm-container">
    <!--选择相册 - 仅在非相册直接上传时显示 -->
    <view v-if="showAlbumSelector" class="choose-album">
      <view class="text">选择相册</view>

      <view class="container" @click="handleClick">
        <view class="left">
          <image :src="albumList[showIndex].coverPhotoUrl" mode="aspectFill"></image>
        </view>
        <view class="right">
          <view class="title">{{ albumList[showIndex].name }}</view>
          <view class="number">{{ albumList[showIndex].number }}张</view>
        </view>
      </view>
      <uni-icons @click="toAlbumList" class="icon" type="right" size="20"></uni-icons>
    </view>



    <view class="showPic">
      <image v-for="(pic,index) in imageAddressList" :key="index" :src="pic"></image>
    </view>

    <!-- 底部上传按钮 -->
    <view class="upload-btn-container">
      <button class="upload-btn" @click="confirmUpload">确认上传</button>
    </view>
  </view>
</template>

<style scoped>
.container .right {
  padding-right: 35rpx;
  text-align: right;
}


.container .right .title {
  font-size: 40rpx;
}

.container .left image {
  height: 120rpx;
  width: 120rpx;
  border-radius: 10rpx;
  transform: translateY(7rpx);
}

.container {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  width: 400rpx;
  height: 150rpx;
  transform: translateX(30rpx);
}


.showPic {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  gap: 20rpx; /* 设置图片之间的间距 */
  margin-left: 3rpx;
  margin-top: 20rpx;
  margin-bottom: 30rpx
}

.showPic image {
  width: 230rpx;
  object-fit: cover;
  height: 230rpx;
}


.choose-album .icon {
  margin-right: 20rpx;
}

.choose-album .album {
  margin-left: auto
}

.choose-album .text {
  font-size: 40rpx;
  font-weight: bold;
  margin-left: 20rpx;
}

.choose-album {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.confirm-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
}


.upload-btn-container {
  padding: 20px 16px;
  background-color: #ffffff;
}

.upload-btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #07c160;
  color: #ffffff;
  font-size: 16px;
  border-radius: 4px;
}
</style>
