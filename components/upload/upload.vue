<template>
	<view class="popup">

    <uni-icons type="back" size="30"></uni-icons>
    <picker mode="selector" :range="albums" range-key="name" @change="onAlbumChange">
      <view class="picker">
        当前相册：{{ selectedAlbum.name }}
      </view>
    </picker>

  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const albums = reactive([
  { id: 1, name: '默认相册' },
  { id: 2, name: '旅行' },
  { id: 3, name: '家庭' },
]);

const onAlbumChange = (event) => {
  const index = event.detail.value;
  selectedAlbum.value = albums[index];
};


const selectedAlbum = ref(albums[0]);
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  height: 1000rpx;
  width: 650rpx;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.picker {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>