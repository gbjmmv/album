<!--个人主页-->


<script setup>
import {ref} from 'vue'
import {onLoad,onShow} from '@dcloudio/uni-app'
import {useUserStore} from '@/stores/user.js'
import {getAvatarUrl} from "@/utils/url";

const userStore = useUserStore()

const user1 = ref({
  nickname: '',
  partner_id: '',
  avatarFile: null
})

const user2 = ref({
  nickname: '',
  partner_id: '',
  avatarFile: null
})
onLoad(async () => {
  const {success} = await userStore.login()
  if (success) {
    const {userInfo} = userStore.getStoredInfo()
    user1.value = {
      nickname: userInfo[0].nickname,
      avatarFile: getAvatarUrl(userInfo[0].avatarUrl),
      partner_id: userInfo[0].partner_id,
    }
    user2.value = {
      nickname: userInfo[1].nickname,
      avatarFile: getAvatarUrl(userInfo[1].avatarUrl),
      partner_id: userInfo[1].partner_id,
    }
  }
});
onShow(async() => {
  console.log("show!")
  const userInfo = await userStore.getUserInfo()
  user1.value = {
    nickname: userInfo[0].nickname,
    avatarFile: getAvatarUrl(userInfo[0].avatarUrl),
    partner_id: userInfo[0].partner_id,
  }
  user2.value = {
    nickname: userInfo[1].nickname,
    avatarFile: getAvatarUrl(userInfo[1].avatarUrl),
    partner_id: userInfo[1].partner_id,
  }
})

const toProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile',
  });
}


const toAlbum =()=>{
  uni.navigateTo({
    url: '/pages/album/album',
  });``
}

const toCoupon =()=>{
  uni.navigateTo({
    url: '/pages/coupon/coupon',
  });``
}

const goToFavorite = () =>{
  uni.navigateTo({
    url: '/pages/FavoritesPage/FavoritesPage',
  });``
}

const test = () =>{
  uni.navigateTo({
    url: '/pages/Comments/Comments',
  });``
}

</script>


<template>
  <view class="container">
    <view class="userInfo">
      <view class="user user1">
        <image :src="user1.avatarFile" mode="aspectFit"></image>
        <view class="userName1">{{ user1.nickname }}</view>
      </view>

      <view class="user user2">
        <image :src="user2.avatarFile" mode="aspectFit"></image>
        <view class="userName1">{{ user2.nickname }}</view>
      </view>
    </view>


    <view class="func">
      <view class="func_part func_part1">
        <view class="like func_part_item" @click="toAlbum">
          <uni-icons class="leftIcon" type="images" size="30" color="#28b389" ></uni-icons>
          <view class="text">我的相册</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>

        <view class="comment func_part_item" @click="test">
          <uni-icons class="leftIcon" type="chatbubble" size="30" color="#28b389"></uni-icons>
          <view class="text">我的评论</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>

        <view class="like func_part_item" @click="goToFavorite">
          <uni-icons class="leftIcon" type="star" size="30" color="#28b389"></uni-icons>
          <view class="text">我的收藏</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>


        <view class="other func_part_item" @click="toCoupon">
          <uni-icons class="leftIcon" type="wallet" size="30" color="#28b389" ></uni-icons>
          <view class="text">兑换券</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>
      </view>


      <view class="func_part func_part2">


        <view class="other func_part_item">
          <uni-icons @click="toProfile" class="leftIcon" type="person" size="30" color="#28b389"></uni-icons>
          <view class="text">个人信息</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>
        <view class="other func_part_item">
          <uni-icons class="leftIcon" type="gear" size="30" color="#28b389"></uni-icons>
          <view class="text">设置</view>
          <uni-icons class="rightIcon" type="right" size="20"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>


<style lang="scss" scoped>


.leftIcon {
  margin-right: 20rpx
}

.text {
  flex: 1
}

.rightIcon {
  margin-left: auto
}

.func .func_part .func_part_item {
  height: 100rpx;
  border-bottom: 1px solid #e0e0e0;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.func .func_part .func_part_item:last-child {

  border-bottom: 0
}

.func .func_part {
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
  margin-bottom: 50rpx;

}
.func .func_part1 {

  height: 400rpx;
}
.func .func_part2 {

  height: 200rpx;
}

.func {
  padding: 80rpx 40rpx;
}


// 用户信息部分
.userInfo view {
  font-weight: 600;
}

.userInfo image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-bottom: 30rpx;
}

.userInfo {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 40rpx;
  //background: #28b389;
  background: linear-gradient(to bottom, skyblue, white);
  backdrop-filter: blur(50px);
  height: 400rpx;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center; /* 使内容水平居中 */
  justify-content: center; /* 使内容垂直居中 */
  margin-top: 10rpx;
}


</style>
