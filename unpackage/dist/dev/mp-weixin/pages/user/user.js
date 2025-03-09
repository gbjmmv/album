"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_url = require("../../utils/url.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const user1 = common_vendor.ref({
      nickname: "",
      partner_id: "",
      avatarFile: null
    });
    const user2 = common_vendor.ref({
      nickname: "",
      partner_id: "",
      avatarFile: null
    });
    common_vendor.onLoad(async () => {
      const { success } = await userStore.login();
      if (success) {
        const { userInfo } = userStore.getStoredInfo();
        user1.value = {
          nickname: userInfo[0].nickname,
          avatarFile: utils_url.getAvatarUrl(userInfo[0].avatarUrl),
          partner_id: userInfo[0].partner_id
        };
        user2.value = {
          nickname: userInfo[1].nickname,
          avatarFile: utils_url.getAvatarUrl(userInfo[1].avatarUrl),
          partner_id: userInfo[1].partner_id
        };
      }
    });
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at pages/user/user.vue:40", "show!");
      const userInfo = await userStore.getUserInfo();
      user1.value = {
        nickname: userInfo[0].nickname,
        avatarFile: utils_url.getAvatarUrl(userInfo[0].avatarUrl),
        partner_id: userInfo[0].partner_id
      };
      user2.value = {
        nickname: userInfo[1].nickname,
        avatarFile: utils_url.getAvatarUrl(userInfo[1].avatarUrl),
        partner_id: userInfo[1].partner_id
      };
    });
    const toProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/profile/profile"
      });
    };
    const toAlbum = () => {
      common_vendor.index.navigateTo({
        url: "/pages/album/album"
      });
    };
    const toCoupon = () => {
      common_vendor.index.navigateTo({
        url: "/pages/coupon/coupon"
      });
    };
    const goToFavorite = () => {
      common_vendor.index.navigateTo({
        url: "/pages/FavoritesPage/FavoritesPage"
      });
    };
    const test = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Comments/Comments"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: user1.value.avatarFile,
        b: common_vendor.t(user1.value.nickname),
        c: user2.value.avatarFile,
        d: common_vendor.t(user2.value.nickname),
        e: common_vendor.p({
          type: "images",
          size: "30",
          color: "#28b389"
        }),
        f: common_vendor.p({
          type: "right",
          size: "20"
        }),
        g: common_vendor.o(toAlbum),
        h: common_vendor.p({
          type: "chatbubble",
          size: "30",
          color: "#28b389"
        }),
        i: common_vendor.p({
          type: "right",
          size: "20"
        }),
        j: common_vendor.o(test),
        k: common_vendor.p({
          type: "star",
          size: "30",
          color: "#28b389"
        }),
        l: common_vendor.p({
          type: "right",
          size: "20"
        }),
        m: common_vendor.o(goToFavorite),
        n: common_vendor.p({
          type: "wallet",
          size: "30",
          color: "#28b389"
        }),
        o: common_vendor.p({
          type: "right",
          size: "20"
        }),
        p: common_vendor.o(toCoupon),
        q: common_vendor.o(toProfile),
        r: common_vendor.p({
          type: "person",
          size: "30",
          color: "#28b389"
        }),
        s: common_vendor.p({
          type: "right",
          size: "20"
        }),
        t: common_vendor.p({
          type: "gear",
          size: "30",
          color: "#28b389"
        }),
        v: common_vendor.p({
          type: "right",
          size: "20"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
