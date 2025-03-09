

<!--相册粗略展示框组件 用于上传-->

<script setup>
import {ref} from 'vue'
const num = defineProps(["number"])
console.log("number: ",num.number)
const albumList = ref([
  {
    albumName: 'album1',
    albumNumber: 100,
    albumPic: '/static/image/3.jpg'
  },
  {
    albumName: 'album2',
    albumNumber: 100,
    albumPic: '/static/image/4.jpg'
  },
  {
    albumName: 'album3',
    albumNumber: 100,
    albumPic: '/static/image/3.jpg'
  },
])

// 点击事件
const handleClick = () => {
  emit('click'); // 触发父组件的点击事件
};

const emit = defineEmits(['click']); // 定义事件
</script>

<template>
  <view class="container" @click="handleClick">
    <view class="left">
      <image :src="albumList[number].albumPic" mode="aspectFill"></image>
    </view>
    <view class="right">
      <view class="title">{{ albumList[number].albumName }}</view>
      <view class="number">{{ albumList[number].albumNumber }}张</view>
    </view>
  </view>
</template>


<style scoped>

.container .right{
  padding-right: 35rpx;
  text-align: right;
}


.container .right .title{
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

</style>