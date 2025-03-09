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
  __name: "profile",
  setup(__props) {
    const isNicknameEditing = common_vendor.ref(false);
    const isPartnerIdEditing = common_vendor.ref(false);
    const handleNicknameEdit = () => {
      isNicknameEditing.value = true;
      setTimeout(() => {
      }, 100);
    };
    const handlePartnerIdEdit = () => {
      isPartnerIdEditing.value = true;
    };
    const handleNicknameBlur = () => {
      isNicknameEditing.value = false;
    };
    const handlePartnerIdBlur = () => {
      isPartnerIdEditing.value = false;
    };
    const userStore = stores_user.useUserStore();
    const profile = common_vendor.ref({
      nickname: "",
      partner_id: "",
      avatarFile: null
    });
    const currentProfile = common_vendor.ref({
      id: "",
      nickname: "",
      partner_id: "",
      avatarFile: null
    });
    common_vendor.onLoad(() => {
      const { userInfo } = userStore.getStoredInfo();
      if (userInfo == null ? void 0 : userInfo[0]) {
        currentProfile.value = {
          id: userInfo[0].id,
          nickname: userInfo[0].nickname,
          avatarFile: utils_url.getAvatarUrl(userInfo[0].avatarUrl),
          partner_id: userInfo[0].partner_id
        };
      } else {
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
        common_vendor.index.navigateTo({ url: "/pages/user/user" });
      }
    });
    common_vendor.onShow(async () => {
      const userInfo = await userStore.getUserInfo();
      currentProfile.value = {
        id: userInfo[0].id,
        nickname: userInfo[0].nickname,
        avatarFile: utils_url.getAvatarUrl(userInfo[0].avatarUrl),
        partner_id: userInfo[0].partner_id
      };
    });
    const chooseAvatar = async () => {
      try {
        const res = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        profile.value.avatarFile = res.tempFilePaths[0];
        currentProfile.value.avatarFile = res.tempFilePaths[0];
        common_vendor.index.__f__("log", "at pages/profile/profile.vue:73", res.tempFilePaths[0]);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:75", "选择图片失败：", error);
      }
    };
    const updateProfile = async () => {
      const userInfo = await userStore.getUserInfo();
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:80", "userInfo", userInfo);
      currentProfile.value = {
        id: userInfo[0].id,
        nickname: userInfo[0].nickname,
        avatarFile: utils_url.getAvatarUrl(userInfo[0].avatarUrl),
        partner_id: userInfo[0].partner_id
      };
    };
    const submitProfile = async () => {
      try {
        common_vendor.index.showLoading({
          title: "更新中..."
        });
        const res = await userStore.updateProfile(profile.value);
        profile.value = {
          nickname: "",
          partner_id: "",
          avatarFile: null
        };
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "success"
          });
        } else {
          throw new Error(res.error);
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "更新失败",
          icon: "none"
        });
      }
      await updateProfile();
    };
    common_vendor.index.hideLoading();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentProfile.value.avatarFile,
        b: common_vendor.o(chooseAvatar),
        c: common_vendor.t(currentProfile.value.nickname),
        d: common_vendor.t(currentProfile.value.id),
        e: isNicknameEditing.value
      }, isNicknameEditing.value ? {
        f: common_vendor.o(handleNicknameBlur),
        g: profile.value.nickname,
        h: common_vendor.o(($event) => profile.value.nickname = $event.detail.value)
      } : {
        i: common_vendor.t(currentProfile.value.nickname || "未设置")
      }, {
        j: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#666"
        }),
        k: common_vendor.o(handleNicknameEdit),
        l: isPartnerIdEditing.value
      }, isPartnerIdEditing.value ? {
        m: common_vendor.o(handlePartnerIdBlur),
        n: profile.value.partner_id,
        o: common_vendor.o(($event) => profile.value.partner_id = $event.detail.value)
      } : {
        p: common_vendor.t(currentProfile.value.partner_id || "未设置")
      }, {
        q: common_vendor.p({
          type: "compose",
          size: "20",
          color: "#666"
        }),
        r: common_vendor.o(handlePartnerIdEdit),
        s: common_vendor.o(submitProfile)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
