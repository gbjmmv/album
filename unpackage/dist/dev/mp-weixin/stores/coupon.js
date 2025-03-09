"use strict";
const common_vendor = require("../common/vendor.js");
const api_coupon = require("../api/coupon.js");
const useCouponStore = common_vendor.defineStore("coupon", () => {
  const pendingUse = common_vendor.ref([]);
  const pendingRedeem = common_vendor.ref([]);
  const completed = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const fetchCoupons = async () => {
    loading.value = true;
    try {
      const result = await api_coupon.couponApi.getCoupons();
      common_vendor.index.__f__("log", "at stores/coupon.js:18", "result.data.pendingRedeem:", result.data.pendingRedeem);
      if (result.code === 0) {
        pendingUse.value = result.data.pendingUse || [];
        pendingRedeem.value = result.data.pendingRedeem || [];
        completed.value = result.data.completed || [];
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/coupon.js:25", "获取兑换券失败:", error);
      common_vendor.index.showToast({
        title: "获取兑换券失败",
        icon: "none"
      });
    } finally {
      loading.value = false;
    }
  };
  const createCoupon = async (couponData) => {
    try {
      common_vendor.index.__f__("log", "at stores/coupon.js:38", "createCoupon:", couponData);
      const result = await api_coupon.couponApi.createCoupon(couponData);
      if (result.code === 0) {
        await fetchCoupons();
        return true;
      }
      return false;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/coupon.js:46", "创建兑换券失败:", error);
      common_vendor.index.showToast({
        title: "创建兑换券失败",
        icon: "none"
      });
      return false;
    }
  };
  const completeCoupon = async (id) => {
    try {
      const result = await api_coupon.couponApi.completeCoupon(id);
      if (result.code === 0) {
        await fetchCoupons();
        return true;
      }
      return false;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/coupon.js:65", "完成兑换券失败:", error);
      common_vendor.index.showToast({
        title: "完成兑换券失败",
        icon: "none"
      });
      return false;
    }
  };
  const deleteCoupon = async (id) => {
    try {
      const result = await api_coupon.couponApi.deleteCoupon(id);
      if (result.code === 0) {
        await fetchCoupons();
        return true;
      }
      return false;
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/coupon.js:84", "删除兑换券失败:", error);
      common_vendor.index.showToast({
        title: "删除兑换券失败",
        icon: "none"
      });
      return false;
    }
  };
  return {
    pendingUse,
    pendingRedeem,
    completed,
    loading,
    fetchCoupons,
    createCoupon,
    completeCoupon,
    deleteCoupon
  };
});
exports.useCouponStore = useCouponStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/coupon.js.map
