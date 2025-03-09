"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_album = require("../../stores/album.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _easycom_uni_icons2)();
}
const _easycom_uni_swipe_action_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "album",
  setup(__props) {
    const albumStore = stores_album.useAlbumStore();
    const albumList = common_vendor.ref([]);
    const options = common_vendor.reactive([
      {
        text: "编辑",
        style: {
          backgroundColor: "#007aff"
        }
      },
      {
        text: "删除",
        style: {
          backgroundColor: "#dd524d"
        }
      }
    ]);
    const showCreateDialog = common_vendor.ref(false);
    const albumName = common_vendor.ref("");
    const openCreateDialog = () => {
      showCreateDialog.value = true;
      albumName.value = "";
    };
    const closeCreateDialog = () => {
      showCreateDialog.value = false;
    };
    const showEditDialog = common_vendor.ref(false);
    const editAlbumName = common_vendor.ref("");
    const currentEditId = common_vendor.ref(null);
    const getAlbum = async () => {
      albumList.value = await albumStore.getAlbumList();
      for (let i = 0; i < albumList.value.length; i++) {
        if (albumList.value[i].coverPhotoUrl) {
          albumList.value[i].coverPhotoUrl = utils_url.getAvatarUrl(albumList.value[i].coverPhotoUrl);
        } else {
          albumList.value[i].coverPhotoUrl = "/static/image/classify.png";
        }
      }
    };
    common_vendor.onLoad(async () => {
      await getAlbum();
    });
    const confirmCreate = async () => {
      if (albumName.value.trim()) {
        await albumStore.createNewAlbum(albumName.value);
        common_vendor.index.__f__("log", "at pages/album/album.vue:60", "创建新相册:", albumName.value);
        closeCreateDialog();
        await getAlbum();
      } else {
        common_vendor.index.showToast({
          title: "请输入相册名称",
          icon: "none"
        });
      }
    };
    const confirmEdit = async () => {
      if (editAlbumName.value.trim()) {
        await albumStore.updateAlbum(currentEditId.value, editAlbumName.value);
        common_vendor.index.__f__("log", "at pages/album/album.vue:79", "更新相册 - ID:", currentEditId.value, "新名称:", editAlbumName.value);
        closeEditDialog();
        await getAlbum();
      } else {
        common_vendor.index.showToast({
          title: "请输入相册名称",
          icon: "none"
        });
      }
    };
    const closeEditDialog = () => {
      showEditDialog.value = false;
      currentEditId.value = null;
    };
    const handleClick = (album) => {
      common_vendor.index.__f__("log", "at pages/album/album.vue:100", "点击相册:", album);
      common_vendor.index.navigateTo({
        url: `/pages/AlbumPage/AlbumPage?id=${album.id}&name=${encodeURIComponent(album.name)}`
      });
    };
    const handleSwipeClick = (e, item, index) => {
      if (e.index === 0) {
        handleEdit(item.id, item.name);
      } else if (e.index === 1) {
        handleDelete(item);
      }
    };
    const handleEdit = (id, name) => {
      common_vendor.index.__f__("log", "at pages/album/album.vue:116", "编辑相册：id=" + id + ", name=" + name);
      currentEditId.value = id;
      editAlbumName.value = name;
      showEditDialog.value = true;
    };
    const handleDelete = (item) => {
      common_vendor.index.__f__("log", "at pages/album/album.vue:126", "删除相册：", item);
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该相册吗？",
        success: async (res) => {
          if (res.confirm) {
            await albumStore.deleteAlbum(item.id);
            await getAlbum();
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(albumList.value, (subAlbum, index, i0) => {
          return {
            a: common_vendor.t(subAlbum.name),
            b: common_vendor.t(subAlbum.number),
            c: subAlbum.coverPhotoUrl,
            d: common_vendor.o(($event) => handleClick(subAlbum), subAlbum.id),
            e: common_vendor.o(($event) => handleSwipeClick($event, subAlbum), subAlbum.id),
            f: "02313f6f-1-" + i0 + "," + ("02313f6f-0-" + i0),
            g: "02313f6f-0-" + i0,
            h: subAlbum.id
          };
        }),
        b: common_vendor.p({
          ["right-options"]: options
        }),
        c: common_vendor.o(openCreateDialog),
        d: common_vendor.p({
          color: "#28b389",
          type: "plus",
          size: "60"
        }),
        e: showCreateDialog.value
      }, showCreateDialog.value ? {
        f: albumName.value,
        g: common_vendor.o(($event) => albumName.value = $event.detail.value),
        h: common_vendor.o(closeCreateDialog),
        i: common_vendor.o(confirmCreate),
        j: common_vendor.o(() => {
        }),
        k: common_vendor.o(closeCreateDialog)
      } : {}, {
        l: showEditDialog.value
      }, showEditDialog.value ? {
        m: editAlbumName.value,
        n: common_vendor.o(($event) => editAlbumName.value = $event.detail.value),
        o: common_vendor.o(closeEditDialog),
        p: common_vendor.o(confirmEdit),
        q: common_vendor.o(() => {
        }),
        r: common_vendor.o(closeEditDialog)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/album/album.js.map
