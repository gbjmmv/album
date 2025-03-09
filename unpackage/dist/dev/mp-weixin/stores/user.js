"use strict";
const common_vendor = require("../common/vendor.js");
const api_user = require("../api/user.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref([]);
  const sessionKey = common_vendor.ref("");
  const getUserInfo = async () => {
    try {
      const res = await api_user.getUserInfoAPI();
      common_vendor.index.__f__("log", "at stores/user.js:16", "pinia中第一时间收到的数据", res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/user.js:19", "获取用户信息失败:", error);
    }
  };
  const login = async () => {
    try {
      const loginResult = await common_vendor.index.login();
      common_vendor.index.__f__("log", "at stores/user.js:27", loginResult.code);
      const res = await api_user.loginAPI(loginResult.code);
      sessionKey.value = res.data.sessionKey;
      userInfo.value = res.data.userInfo;
      common_vendor.index.__f__("log", "at stores/user.js:35", "res", res);
      common_vendor.index.setStorageSync("token", res.data.token);
      common_vendor.index.setStorageSync("main album", res.data.userInfo[0].mainAlbumsId);
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/user.js:43", "登录失败：", error);
      common_vendor.index.showToast({
        title: "登录失败",
        icon: "none"
      });
      return { success: false, error };
    }
  };
  const getStoredInfo = () => {
    common_vendor.index.__f__("log", "at stores/user.js:55", userInfo.value[0].avatarUrl);
    return { userInfo: userInfo.value };
  };
  const updateProfile = async (profileData) => {
    var _a, _b;
    try {
      const updateData = {
        nickname: (_a = profileData.nickname) == null ? void 0 : _a.trim(),
        partner_id: profileData.partner_id ? String(profileData.partner_id).trim() : "",
        avatarFile: profileData.avatarFile
      };
      common_vendor.index.__f__("log", "at stores/user.js:66", "store:updateData", updateData);
      const res = await api_user.updateUserProfileAPI(updateData);
      if ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.userInfo) {
        userInfo.value = res.data.userInfo;
      }
      return { success: true, data: res.data };
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/user.js:74", "更新个人资料失败:", error);
      return { success: false, error: error.message || "更新失败" };
    }
  };
  return {
    sessionKey,
    userInfo,
    login,
    getStoredInfo,
    updateProfile,
    getUserInfo
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
