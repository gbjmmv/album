<script setup>
import {ref,computed,watch,watchEffect} from 'vue'
import {useUserStore} from '@/stores/user.js'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {getAvatarUrl} from '@/utils/url.js'
const isAvatarChanged = ref(false)
const isNicknameEditing = ref(false)
const isPartnerIdEditing = ref(false)
const handleNicknameEdit = () => {
  isNicknameEditing.value = true
  setTimeout(() => {
  }, 100)
}


const handlePartnerIdEdit = () => {
  isPartnerIdEditing.value = true
}
const handleNicknameBlur = () => {
  isNicknameEditing.value = false
}
const handlePartnerIdBlur = () => {
  isPartnerIdEditing.value = false
}


const userStore = useUserStore()
const profile = ref({
  nickname: '',
  partner_id: '',
  avatarFile: null
})

const currentProfile = ref({
  id: '',
  nickname: '',
  partner_id: '',
  avatarFile: null
})

watchEffect(()=>{
  console.log('Current avatar:', currentProfile.value.avatarFile)
  console.log('Is avatar changed:', isAvatarChanged.value)
})
onLoad(() => {
  const {userInfo} = userStore.getStoredInfo()
  if (userInfo?.[0]) {
    currentProfile.value = {
      id: userInfo[0].id,
      nickname: userInfo[0].nickname,
      avatarFile: getAvatarUrl(userInfo[0].avatarUrl),
      partner_id: userInfo[0].partner_id,
    }
  } else {
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'none'
    })
    uni.navigateTo({url: '/pages/user/user'})
  }
})
onShow(async () => {
  console.log("onshow触发")
  if (!isAvatarChanged.value) {
    const userInfo = await userStore.getUserInfo()
    currentProfile.value = {
      id: userInfo[0].id,
      nickname: userInfo[0].nickname,
      avatarFile: getAvatarUrl(userInfo[0].avatarUrl),
      partner_id: userInfo[0].partner_id,
    }
  }
})


// 选择头像
const chooseAvatar = async () => {
  isAvatarChanged.value = true
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })

    profile.value.avatarFile = res.tempFilePaths[0]
    currentProfile.value.avatarFile = res.tempFilePaths[0]


  } catch (error) {
    console.error('选择图片失败：', error)
  }
}
const updateProfile = async () => {
  const userInfo = await userStore.getUserInfo()
  console.log("userInfo", userInfo)
  currentProfile.value = {
    id: userInfo[0].id,
    nickname: userInfo[0].nickname,
    avatarFile: getAvatarUrl(userInfo[0].avatarUrl),
    partner_id: userInfo[0].partner_id,
  }
}
const submitProfile = async () => {
  try {
    uni.showLoading({
      title: '更新中...'
    })
    const res = await userStore.updateProfile(profile.value)
    isAvatarChanged.value = false
    profile.value = {
      nickname: '',
      partner_id: '',
      avatarFile: null
    }
    uni.hideLoading()
    if (res.success) {
      uni.showToast({
        title: '更新成功',
        icon: 'success'
      })
    } else {
      throw new Error(res.error)
    }


  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '更新失败',
      icon: 'none'
    })
  }
  await updateProfile()
}
uni.hideLoading()
</script>

<template>
  <view class="profile-container">

    <view class="avatar-section">
      <image :src="currentProfile.avatarFile" mode="aspectFill" @tap="chooseAvatar"/>
      <text>{{ currentProfile.nickname }}</text>
    </view>


    <view class="container">
      <!-- ID显示 -->
      <view class="info-row">
        <text class="label">你的ID:</text>
        <text class="value">{{ currentProfile.id }}</text>
      </view>

      <!-- 昵称显示/编辑 -->
      <view class="info-row">
        <text class="label">昵称:</text>
        <view class="value-section">
          <input v-if="isNicknameEditing"
                 type="text"
                 v-model="profile.nickname"
                 placeholder="请输入昵称"
                 class="input-field"
                 @blur="handleNicknameBlur"/>
          <text v-else class="value">{{ currentProfile.nickname || '未设置' }}</text>
          <view class="icon-wrapper" @tap="handleNicknameEdit">
            <uni-icons type="compose"
                       size="20"
                       color="#666"
                       class="edit-icon">
            </uni-icons>
          </view>
        </view>
      </view>

      <!-- 伴侣ID显示/编辑 -->
      <view class="info-row">
        <text class="label">伴侣ID:</text>
        <view class="value-section">
          <input v-if="isPartnerIdEditing"
                 type="text"
                 v-model="profile.partner_id"
                 placeholder="请输入伴侣ID"
                 class="input-field"
                 @blur="handlePartnerIdBlur"/>
          <text v-else class="value">{{ currentProfile.partner_id || '未设置' }}</text>
          <view class="icon-wrapper" @tap="handlePartnerIdEdit">
            <uni-icons type="compose"
                       size="20"
                       color="#666"
                       class="edit-icon">
            </uni-icons>
          </view>
        </view>
      </view>
    </view>


    <!-- 提交按钮 -->
    <button @tap="submitProfile" type="primary">确认修改</button>
  </view>
</template>


<style>
.container {
  padding: 30rpx;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #eee;
}

.label {
  width: 140rpx;
  font-size: 28rpx;
  color: #666;
}

.value-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.input-field {
  flex: 1;
  font-size: 28rpx;
  padding: 10rpx 0;
  border-bottom: 1px solid #007AFF;
}

.edit-icon {
  margin-left: 20rpx;
  padding: 10rpx;
}

/* 点击状态 */
.edit-icon:active {
  opacity: 0.7;
}


.avatar-section {
  background: linear-gradient(to bottom, skyblue, white);
  background-size: cover;
  background-position: center;
  height: 450rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}


.avatar-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1;
}


.avatar-section image,
.avatar-section text {
  position: relative;
  z-index: 2;
}

.avatar-section text {
  color: #000000;
  font-size: 42rpx;
  font-weight: bold;
}


.avatar-section image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 40rpx;
}

</style>
