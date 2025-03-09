<template>
  <view class="coupon-page">
    <!-- 顶部切换选项卡 -->
    <view class="tab-container">
      <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
      >
        <text>{{ tab.name }}</text>
        <view v-if="activeTab === index" class="tab-line"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area" :class="'bg-' + activeTab">
      <!-- 创建按钮 -->
      <view class="create-btn" @click="openCreateModal">
        <text class="create-icon">+</text>
        <text>创建兑换券</text>
      </view>

      <!-- 兑换券列表 -->
      <scroll-view scroll-y class="coupon-list">
        <template v-if="activeTabCoupons.length > 0">
          <view
              v-for="coupon in activeTabCoupons"
              :key="coupon.id"
              class="coupon-card"
          >
            <view class="coupon-header">
              <text class="coupon-title">{{ coupon.title }}</text>
              <text class="coupon-date">{{ formatDate(coupon.createTime) }}</text>
            </view>
            <view v-if="coupon.description" class="coupon-desc">
              {{ coupon.description }}
            </view>
            <view class="coupon-footer">
              <view class="coupon-user">
                <template v-if="activeTab === 0">
                  <text>来自: {{ coupon.creatorNickname }}</text>
                </template>
                <template v-if="activeTab === 1">
                  <text>给予: {{ coupon.receiverNickname }}</text>
                </template>
                <template v-if="activeTab === 2">
                  <text>{{ coupon.creatorNickname }} ⟷ {{ coupon.receiverNickname }}</text>
                  <text class="complete-date">完成于: {{ formatDate(coupon.completeTime) }}</text>
                </template>
              </view>
              <view v-if="activeTab !== 2" class="coupon-actions">
                <button class="btn complete-btn" @click="handleComplete(coupon.id)">完成兑现!</button>
                <button class="btn delete-btn" @click="handleDelete(coupon.id)">删除兑换券</button>
              </view>
            </view>
          </view>
        </template>
        <view v-else class="empty-list">
          <text>暂无{{ tabs[activeTab].name }}的兑换券~</text>
        </view>
      </scroll-view>
    </view>

    <!-- 创建兑换券弹窗 -->
    <uni-popup ref="createPopup" type="center" background-color="#fff">
      <view class="create-modal">
        <view class="modal-title">创建兑换券</view>
        <view class="modal-content">
          <view class="input-group">
            <text class="label">兑换券标题 *</text>
            <input
                type="text"
                v-model="newCoupon.title"
                placeholder="请输入标题"
                class="input-field"
            />
          </view>
          <view class="input-group">
            <text class="label">兑换券详情</text>
            <textarea
                v-model="newCoupon.description"
                placeholder="请输入详情（可选）"
                class="textarea-field"
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn cancel-btn" @click="closeCreateModal">取消</button>
          <button class="btn confirm-btn" @click="confirmCreate" :disabled="!newCoupon.title">确定</button>
        </view>
      </view>
    </uni-popup>

    <!-- 确认弹窗 -->
    <uni-popup ref="confirmPopup" type="center" background-color="#fff">
      <view class="confirm-modal">
        <view class="modal-title">{{ confirmModalType === 'complete' ? '完成兑现' : '删除兑换券' }}</view>
        <view class="modal-content">
          <text>{{ confirmModalType === 'complete' ? '确定要完成兑现这张兑换券吗？' : '确定要删除这张兑换券吗？' }}</text>
        </view>
        <view class="modal-footer">
          <button class="btn cancel-btn" @click="closeConfirmModal">取消</button>
          <button
              class="btn"
              :class="confirmModalType === 'complete' ? 'complete-btn' : 'delete-btn'"
              @click="confirmAction"
          >
            确定
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCouponStore } from '@/stores/coupon'

// 获取store
const couponStore = useCouponStore()

// 标签页配置
const tabs = [
  { name: '待使用', key: 'pendingUse' },
  { name: '待兑现', key: 'pendingRedeem' },
  { name: '已完成', key: 'completed' }
]

// 状态
const activeTab = ref(0)
const newCoupon = ref({
  title: '',
  description: ''
})
const confirmModalType = ref('')
const currentCouponId = ref(null)

// 组件引用
const createPopup = ref(null)
const confirmPopup = ref(null)

// 计算当前标签页的兑换券列表
const activeTabCoupons = computed(() => {
  const key = tabs[activeTab.value].key
  return couponStore[key]
})

// 初始化加载数据
onMounted(async () => {
  await couponStore.fetchCoupons()
})

// 格式化日期
const formatDate = (dateValue) => {
  if (!dateValue) return ''

  // 处理数组格式的日期 [year, month, day, hour, minute, second]
  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // 处理字符串格式的日期
  const date = new Date(dateValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 打开创建弹窗
const openCreateModal = () => {
  createPopup.value.open('center')
}

// 关闭创建弹窗
const closeCreateModal = () => {
  createPopup.value.close()
  newCoupon.value = { title: '', description: '' }
}

// 确认创建
const confirmCreate = async () => {
  if (!newCoupon.value.title) {
    uni.showToast({
      title: '请输入兑换券标题',
      icon: 'none'
    })
    return
  }
  const success = await couponStore.createCoupon(newCoupon.value)
  if (success) {
    uni.showToast({
      title: '创建成功！',
      icon: 'success'
    })
    closeCreateModal()
  }
}

// 处理完成兑现
const handleComplete = (id) => {
  confirmModalType.value = 'complete'
  currentCouponId.value = id
  confirmPopup.value.open('center')
}

// 处理删除
const handleDelete = (id) => {
  confirmModalType.value = 'delete'
  currentCouponId.value = id
  confirmPopup.value.open('center')
}

// 关闭确认弹窗
const closeConfirmModal = () => {
  confirmPopup.value.close()
  currentCouponId.value = null
}

// 确认操作
const confirmAction = async () => {
  if (!currentCouponId.value) return

  let success = false
  if (confirmModalType.value === 'complete') {
    success = await couponStore.completeCoupon(currentCouponId.value)
    if (success) {
      uni.showToast({
        title: '兑现成功！',
        icon: 'success'
      })
    }
  } else {
    success = await couponStore.deleteCoupon(currentCouponId.value)
    if (success) {
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }
  }

  closeConfirmModal()
}
</script>

<style scoped>
.coupon-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 标签栏样式 */
.tab-container {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.tab-item {
  position: relative;
  padding: 16rpx 20rpx;
  font-size: 30rpx;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-item.active {
  color: #ff6b81;
  font-weight: bold;
}

.tab-line {
  position: absolute;
  bottom: -10rpx;
  width: 60rpx;
  height: 6rpx;
  background-color: #ff6b81;
  border-radius: 3rpx;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 30rpx;
  position: relative;
}

.bg-0 {
  background-color: #fff5f7; /* 待使用背景色 */
}

.bg-1 {
  background-color: #f0f8ff; /* 待兑现背景色 */
}

.bg-2 {
  background-color: #f5fff0; /* 已完成背景色 */
}

/* 创建按钮 */
.create-btn {
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
  height: 80rpx;
  background-color: #ff6b81;
  color: white;
  border-radius: 50rpx;
  padding: 12rpx 30rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 8rpx rgba(255, 107, 129, 0.3);
  z-index: 2;
}

.create-icon {
  font-size: 32rpx;
  margin-right: 8rpx;
}

/* 兑换券列表 */
.coupon-list {

  height: calc(100vh - 240rpx);
}

.coupon-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.coupon-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.coupon-date {
  font-size: 24rpx;
  color: #999;
}

.coupon-desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.coupon-footer {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.coupon-user {
  font-size: 26rpx;
  color: #888;
  display: flex;
  flex-direction: column;
}

.complete-date {
  margin-top: 10rpx;
  font-size: 24rpx;
}

.coupon-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.btn {
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  border: none;
}

.complete-btn {
  background-color: #42b983;
  color: white;
}

.delete-btn {
  background-color: #ff6b6b;
  color: white;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  width: 150rpx;
  border-radius:10rpx;
}

.confirm-btn {
  background-color: #4285f4;
  color: white;
  width: 150rpx;
  border-radius:10rpx;
}


/* 空列表提示 */
.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  color: #999;
  font-size: 28rpx;
}

/* 创建兑换券弹窗 */
.create-modal {
  width: 650rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.modal-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.modal-content {
  margin-bottom: 30rpx;
}

.input-group {
  margin-bottom: 20rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.input-field {
  width: 95%;
  height: 80rpx;
  border: 1px solid #eee;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.textarea-field {
  width: 95%;
  height: 200rpx;
  border: 1px solid #eee;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
}

/* 确认弹窗 */
.confirm-modal {
  width: 500rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
}
</style>