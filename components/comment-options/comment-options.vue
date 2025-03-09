<template>
  <view>
    <!-- 长按评论后的操作菜单 -->
    <uni-popup ref="commentOptionsPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-item" @click="handleEdit">
          <text class="popup-text">修改</text>
        </view>
        <view class="popup-item" @click="handleDelete">
          <text class="popup-text">删除</text>
        </view>
        <view class="popup-item cancel" @click="closePopup">
          <text class="popup-text">取消</text>
        </view>
      </view>
    </uni-popup>

    <!-- 修改评论的弹出框 -->
    <uni-popup ref="editCommentPopup" type="dialog">
      <uni-popup-dialog
          title="修改评论"
          v-model="editContent"
          placeholder="请输入评论内容"
          :before-close="true"
          @confirm="confirmEdit"
          @close="closeEditPopup"
          mode="input"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 删除确认弹出框 -->
    <uni-popup ref="deleteConfirmPopup" type="dialog">
      <uni-popup-dialog
          title="确认删除"
          content="确定要删除这条评论吗？删除后将无法恢复。"
          :before-close="true"
          @confirm="confirmDelete"
          @close="closeDeletePopup"
          confirmText="删除"
          cancelText="取消"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue';
const props = defineProps({
  commentData: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update', 'delete']);
// 弹窗引用
const commentOptionsPopup = ref(null);
const editCommentPopup = ref(null);
const deleteConfirmPopup = ref(null);
// 修改内容
const editContent = ref('');

// 打开评论选项弹窗
const open = (comment) => {
  // 保存当前评论数据
  editContent.value = comment.content || '';
  commentOptionsPopup.value.open();
};

// 关闭评论选项弹窗
const closePopup = () => {
  commentOptionsPopup.value.close();
};

// 处理修改评论
const handleEdit = () => {
  commentOptionsPopup.value.close();

  nextTick(() => {
    // 确保在打开编辑弹窗前重新设置评论内容
    editContent.value = props.commentData.content || '';
    editCommentPopup.value.open();
  });
};

// 关闭修改评论弹窗
const closeEditPopup = () => {
  editCommentPopup.value.close();
};

// 确认修改评论
const confirmEdit = async () => {
  if (!editContent.value.trim()) {
    uni.showToast({
      title: '评论内容不能为空',
      icon: 'none'
    });
    return;
  }

  // 使用当前编辑框的内容
  emit('update', {
    id: props.commentData.id,
    content: editContent.value.trim()
  });

  editCommentPopup.value.close();
};

// 处理删除评论
const handleDelete = () => {
  commentOptionsPopup.value.close();

  nextTick(() => {
    deleteConfirmPopup.value.open();
  });
};

// 关闭删除确认弹窗
const closeDeletePopup = () => {
  deleteConfirmPopup.value.close();
};

// 确认删除评论
const confirmDelete = () => {
  emit('delete', {
    id: props.commentData.id
  });

  deleteConfirmPopup.value.close();
};

// 暴露方法给父组件
defineExpose({
  open
});
</script>


<style>
.popup-content {
  padding: 20rpx 0;
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
}

.popup-item {
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.popup-text {
  font-size: 32rpx;
  color: #333;
}

.popup-item.cancel {
  margin-top: 16rpx;
}

.cancel .popup-text {
  color: #666;
}
</style>