"use strict";
const utils_http = require("../utils/http.js");
const couponApi = {
  // 获取所有状态的兑换券
  getCoupons() {
    return utils_http.http.get("/api/coupons");
  },
  // 创建兑换券
  createCoupon(data) {
    return utils_http.http.postJSON("/api/coupons", data);
  },
  // 完成兑换券
  completeCoupon(id) {
    return utils_http.http.put(`/api/coupons/${id}/complete`);
  },
  // 删除兑换券
  deleteCoupon(id) {
    return utils_http.http.delete(`/api/coupons/${id}`);
  }
};
exports.couponApi = couponApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/coupon.js.map
