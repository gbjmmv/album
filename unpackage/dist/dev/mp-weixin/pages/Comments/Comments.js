"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_commentStore = require("../../stores/commentStore.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_load_more + CommentOptions)();
}
const CommentOptions = () => "../../components/comment-options/comment-options.js";
const _sfc_main = {
  __name: "Comments",
  setup(__props) {
    const loadingText = {
      contentdown: "上拉加载更多",
      contentrefresh: "加载中...",
      contentnomore: "没有更多了"
    };
    const commentStore = stores_commentStore.useCommentStore();
    const selectedComment = common_vendor.ref(null);
    const commentOptionsRef = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      commentStore.fetchUserComments(true);
    });
    common_vendor.onPullDownRefresh(() => {
      commentStore.refreshComments();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    common_vendor.onReachBottom(() => {
      if (commentStore.hasMore) {
        commentStore.loadMore();
      }
    });
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0") + " " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    };
    const previewImage = (url) => {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    };
    const showCommentOptions = (comment) => {
      common_vendor.index.__f__("log", "at pages/Comments/Comments.vue:64", "页面comment.content: ", comment.content);
      selectedComment.value = comment;
      common_vendor.nextTick$1(() => {
        commentOptionsRef.value.open(comment);
      });
    };
    const handleCommentUpdate = async (commentData) => {
      await commentStore.updateComment(commentData);
    };
    const handleCommentDelete = async (commentData) => {
      await commentStore.deleteComment(commentData);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(commentStore).loading
      }, common_vendor.unref(commentStore).loading ? {
        b: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText
        })
      } : common_vendor.unref(commentStore).isEmpty ? {} : common_vendor.e({
        d: common_vendor.f(common_vendor.unref(commentStore).photoComments, (item, index, i0) => {
          return {
            a: common_vendor.t(item.subAlbumName),
            b: item.url,
            c: common_vendor.o(($event) => previewImage(item.url), item.id),
            d: common_vendor.f(item.comments, (comment, cIndex, i1) => {
              return {
                a: common_vendor.t(comment.content),
                b: common_vendor.t(formatDate(comment.createdAt)),
                c: comment.id,
                d: common_vendor.o(($event) => showCommentOptions(comment), comment.id)
              };
            }),
            e: item.id
          };
        }),
        e: common_vendor.unref(commentStore).hasMore
      }, common_vendor.unref(commentStore).hasMore ? {
        f: common_vendor.o(common_vendor.unref(commentStore).loadMore),
        g: common_vendor.p({
          status: common_vendor.unref(commentStore).loadMoreStatus
        })
      } : {}), {
        c: common_vendor.unref(commentStore).isEmpty,
        h: common_vendor.sr(commentOptionsRef, "ea48c0cc-2", {
          "k": "commentOptionsRef"
        }),
        i: common_vendor.o(handleCommentUpdate),
        j: common_vendor.o(handleCommentDelete),
        k: common_vendor.p({
          ["comment-data"]: selectedComment.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Comments/Comments.js.map
