<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {onPullDownRefresh, onReachBottom} from '@dcloudio/uni-app';
import {useCommentStore} from '@/stores/commentStore';
import CommentOptions from '@/components/comment-options/comment-options.vue'
// 加载状态文本
const loadingText = {
  contentdown: '上拉加载更多',
  contentrefresh: '加载中...',
  contentnomore: '没有更多了'
};

// 使用评论Store
const commentStore = useCommentStore();

// 选中的评论相关数据
const selectedComment = ref(null);
const commentOptionsRef = ref(null);

// 页面初始化时加载评论数据
onMounted(() => {
  commentStore.fetchUserComments(true);
});

// 监听下拉刷新
onPullDownRefresh(() => {
  commentStore.refreshComments();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});

// 监听页面滚动到底部
onReachBottom(() => {
  if (commentStore.hasMore) {
    commentStore.loadMore();
  }
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 始终显示年月日和具体时间 (YYYY-MM-DD HH:MM)
  return date.getFullYear() + '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
      date.getDate().toString().padStart(2, '0') + ' ' +
      date.getHours().toString().padStart(2, '0') + ':' +
      date.getMinutes().toString().padStart(2, '0');
};

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  });
};

// 显示评论操作选项
const showCommentOptions = (comment) => {
  console.log("页面comment.content: ",comment.content);
  selectedComment.value = comment;
  nextTick(() => {
    commentOptionsRef.value.open(comment);
  });
};

// 处理评论更新
const handleCommentUpdate = async (commentData) => {
  await commentStore.updateComment(commentData);
};

// 处理评论删除
const handleCommentDelete = async (commentData) => {
  await commentStore.deleteComment(commentData);
};
</script>


<template>
  <view class="comments-container">
    <view v-if="commentStore.loading" class="loading-container">
      <uni-load-more status="loading" :content-text="loadingText"></uni-load-more>
    </view>

    <view v-else-if="commentStore.isEmpty" class="empty-container">
      <text class="empty-text">暂无评论记录</text>
    </view>

    <view v-else class="photo-comments-list">
      <!-- 照片和评论部分，每次加载10个 -->
      <view
          v-for="(item, index) in commentStore.photoComments"
          :key="item.id"
          class="photo-comment-item"
      >
        <view class="item-header">
          <text class="album-name">{{ item.subAlbumName }}</text>
        </view>

        <view class="item-content">
          <!-- 左侧照片部分 -->
          <view class="photo-container">
            <image
                class="photo"
                :src="item.url"
                mode="aspectFill"
                @click="previewImage(item.url)"
            ></image>
          </view>

          <!-- 右侧评论列表部分 -->
          <view class="comments-list">
            <view
                v-for="(comment, cIndex) in item.comments"
                :key="comment.id"
                class="comment-item"
                @longpress="showCommentOptions(comment)"
            >
              <text class="comment-content">{{ comment.content }}</text>
              <text class="comment-time">{{ formatDate(comment.createdAt) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="commentStore.hasMore" class="load-more">
        <uni-load-more
            :status="commentStore.loadMoreStatus"
            @clickLoadMore="commentStore.loadMore"
        ></uni-load-more>
      </view>
    </view>

    <!-- 使用复用的评论操作组件 -->
    <comment-options
        ref="commentOptionsRef"
        :comment-data="selectedComment"
        @update="handleCommentUpdate"
        @delete="handleCommentDelete"
    />
  </view>
</template>


<style>
.comments-container {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

.photo-comments-list {
  margin-bottom: 30rpx;
}

.photo-comment-item {
  margin-bottom: 30rpx;
  border-radius: 12rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.item-header {
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.album-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.item-content {
  display: flex;
  padding: 24rpx;
}

.photo-container {
  width: 200rpx;
  height: 200rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.photo {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.comments-list {
  flex: 1;
  overflow: hidden;
}

.comment-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  word-break: break-all;
}

.comment-time {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.load-more {
  padding: 30rpx 0;
  text-align: center;
}
</style>