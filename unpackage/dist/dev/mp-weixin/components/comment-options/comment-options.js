"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_uni_popup2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _easycom_uni_popup_dialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_popup + _easycom_uni_popup_dialog)();
}
const _sfc_main = {
  __name: "comment-options",
  props: {
    commentData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["update", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const commentOptionsPopup = common_vendor.ref(null);
    const editCommentPopup = common_vendor.ref(null);
    const deleteConfirmPopup = common_vendor.ref(null);
    const editContent = common_vendor.ref("");
    const open = (comment) => {
      editContent.value = comment.content || "";
      commentOptionsPopup.value.open();
    };
    const closePopup = () => {
      commentOptionsPopup.value.close();
    };
    const handleEdit = () => {
      commentOptionsPopup.value.close();
      common_vendor.nextTick$1(() => {
        editContent.value = props.commentData.content || "";
        editCommentPopup.value.open();
      });
    };
    const closeEditPopup = () => {
      editCommentPopup.value.close();
    };
    const confirmEdit = async () => {
      if (!editContent.value.trim()) {
        common_vendor.index.showToast({
          title: "评论内容不能为空",
          icon: "none"
        });
        return;
      }
      emit("update", {
        id: props.commentData.id,
        content: editContent.value.trim()
      });
      editCommentPopup.value.close();
    };
    const handleDelete = () => {
      commentOptionsPopup.value.close();
      common_vendor.nextTick$1(() => {
        deleteConfirmPopup.value.open();
      });
    };
    const closeDeletePopup = () => {
      deleteConfirmPopup.value.close();
    };
    const confirmDelete = () => {
      emit("delete", {
        id: props.commentData.id
      });
      deleteConfirmPopup.value.close();
    };
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleEdit),
        b: common_vendor.o(handleDelete),
        c: common_vendor.o(closePopup),
        d: common_vendor.sr(commentOptionsPopup, "00e8e452-0", {
          "k": "commentOptionsPopup"
        }),
        e: common_vendor.p({
          type: "bottom"
        }),
        f: common_vendor.o(confirmEdit),
        g: common_vendor.o(closeEditPopup),
        h: common_vendor.o(($event) => editContent.value = $event),
        i: common_vendor.p({
          title: "修改评论",
          placeholder: "请输入评论内容",
          ["before-close"]: true,
          mode: "input",
          modelValue: editContent.value
        }),
        j: common_vendor.sr(editCommentPopup, "00e8e452-1", {
          "k": "editCommentPopup"
        }),
        k: common_vendor.p({
          type: "dialog"
        }),
        l: common_vendor.o(confirmDelete),
        m: common_vendor.o(closeDeletePopup),
        n: common_vendor.p({
          title: "确认删除",
          content: "确定要删除这条评论吗？删除后将无法恢复。",
          ["before-close"]: true,
          confirmText: "删除",
          cancelText: "取消"
        }),
        o: common_vendor.sr(deleteConfirmPopup, "00e8e452-3", {
          "k": "deleteConfirmPopup"
        }),
        p: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/comment-options/comment-options.js.map
