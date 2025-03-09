"use strict";
const common_vendor = require("../common/vendor.js");
const utils_http = require("../utils/http.js");
const loginAPI = (code) => {
  return utils_http.http.postJSON("/user/login", {
    code
    // 确保是以对象形式传递
  });
};
const getUserInfoAPI = () => {
  return utils_http.http.get("/user/info");
};
const updateUserProfileAPI = async (profileData) => {
  try {
    const { nickname, partner_id, avatarFile } = profileData;
    const formData = {};
    if (nickname == null ? void 0 : nickname.trim()) {
      formData.nickname = nickname.trim();
    }
    if (partner_id && String(partner_id).trim()) {
      formData.partner_id = String(partner_id).trim();
    }
    const API_ENDPOINT = "/user/profile/update";
    if (avatarFile) {
      const uploadConfig = {
        header: {
          "Content-Type": "multipart/form-data"
        },
        name: "avatar"
      };
      return utils_http.http.upload(API_ENDPOINT, avatarFile, formData, uploadConfig);
    } else {
      return utils_http.http.postForm(API_ENDPOINT, formData);
    }
    throw new Error("没有有效的更新数据");
  } catch (error) {
    common_vendor.index.__f__("error", "at api/user.js:37", "更新个人资料失败:", error);
    common_vendor.index.showToast({
      title: error.message || "更新失败，请重试",
      icon: "none"
    });
    throw error;
  }
};
exports.getUserInfoAPI = getUserInfoAPI;
exports.loginAPI = loginAPI;
exports.updateUserProfileAPI = updateUserProfileAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
