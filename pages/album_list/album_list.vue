<script setup>
import {ref} from 'vue'
import {useAlbumStore} from '@/stores/album.js'
import {getAvatarUrl} from "@/utils/url";
import {onLoad, onShow} from '@dcloudio/uni-app'

const albumStore = useAlbumStore()
const albumList = ref([])
const getAlbum = async () => {
  albumList.value = await albumStore.getAlbumList()
  for (let i = 0; i < albumList.value.length; i++) {
    if (albumList.value[i].coverPhotoUrl) {
      albumList.value[i].coverPhotoUrl = getAvatarUrl(albumList.value[i].coverPhotoUrl)
    } else {
      albumList.value[i].coverPhotoUrl = "/static/image/classify.png"
    }
  }
}

onLoad(async () => {
  console.log("触发onLoad")
  await getAlbum()
})



const inputValue = ref("")
const choose = (id, index) => {
  albumStore.id_index.value = {
    id,
    index
  };
  // 返回上一个页面
  uni.navigateBack();
}
const show = ref(false)

function createNewAlbum() {
  show.value = true
}

function cancelNewAlbum() {
  show.value = false
}

</script>


<template>

  <view class="container-whole">
    <view class="list" v-for="(item,index) in albumList"
          :key="item.id">

      <view class="container" @click="choose(item.id,index)">
        <view class="left">
          <image :src="albumList[index].coverPhotoUrl" mode="aspectFill"></image>
        </view>
        <view class="right">
          <view class="title">{{ albumList[index].name }}</view>
          <view class="number">{{ albumList[index].number }}张</view>
        </view>
      </view>

    </view>
  </view>
  <view class="create">
    <view class="text">新建相册</view>
    <uni-icons @click="createNewAlbum" class="plus" color="#28b389" type="plus" size="60"></uni-icons>
  </view>
  <view class="name" v-show="show">
    <input class="input" v-model="inputValue" placeholder="请输入相册名"/>
    <button>确认</button>
    <button @click="cancelNewAlbum">取消</button>
  </view>

</template>


<style>


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
  padding-right: 20rpx;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  width: 400rpx;
  height: 150rpx;
}

button {
  margin-top: 30rpx;
  height: 60rpx;
  width: 120rpx;
  font-size: 30rpx;
  line-height: 60rpx;
}

.name {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.input {
  margin-top: 30rpx;
  border: 1px solid black;
  height: 60rpx;
  width: 300rpx;
  border-radius: 15rpx;
}

.create {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.create .plus {
  margin: 0 30rpx
}

.container-whole {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.list {
  margin-top: 30rpx;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

}

album_title {
  transform: translate(30rpx, -15rpx);
}
</style>
