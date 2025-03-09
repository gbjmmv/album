<!--主页的小标题-->

<template>
  <view class="title">
    <view class="name">
      {{ left }}
    </view>
    <view class="other">
      {{ right }}
    </view>
  </view>
</template>

<script setup>

defineProps({
  left:{
    type: String,
    default: ''
  },
  right:{
    type: String,
    default: ''
  }
})

</script>

<style scoped>
.title {
  padding-left:30rpx;
  padding-right:20rpx;
  width: 690rpx;

  display: flex;
  justify-content: space-between;
  align-content: center;
}
.name {
  font-size: 40rpx;

}
.other {
  font-size: 25rpx;
  transform: translate(10px, 5px);
}
</style>