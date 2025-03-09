"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_coupon = require("../../stores/coupon.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "coupon",
  setup(__props) {
    const couponStore = stores_coupon.useCouponStore();
    const tabs = [
      { name: "待使用", key: "pendingUse" },
      { name: "待兑现", key: "pendingRedeem" },
      { name: "已完成", key: "completed" }
    ];
    const activeTab = common_vendor.ref(0);
    const newCoupon = common_vendor.ref({
      title: "",
      description: ""
    });
    const confirmModalType = common_vendor.ref("");
    const currentCouponId = common_vendor.ref(null);
    const createPopup = common_vendor.ref(null);
    const confirmPopup = common_vendor.ref(null);
    const activeTabCoupons = common_vendor.computed(() => {
      const key = tabs[activeTab.value].key;
      return couponStore[key];
    });
    common_vendor.onMounted(async () => {
      await couponStore.fetchCoupons();
    });
    const formatDate = (dateValue) => {
      if (!dateValue)
        return "";
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
      const date = new Date(dateValue);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };
    const openCreateModal = () => {
      createPopup.value.open("center");
    };
    const closeCreateModal = () => {
      createPopup.value.close();
      newCoupon.value = { title: "", description: "" };
    };
    const confirmCreate = async () => {
      if (!newCoupon.value.title) {
        common_vendor.index.showToast({
          title: "请输入兑换券标题",
          icon: "none"
        });
        return;
      }
      const success = await couponStore.createCoupon(newCoupon.value);
      if (success) {
        common_vendor.index.showToast({
          title: "创建成功！",
          icon: "success"
        });
        closeCreateModal();
      }
    };
    const handleComplete = (id) => {
      confirmModalType.value = "complete";
      currentCouponId.value = id;
      confirmPopup.value.open("center");
    };
    const handleDelete = (id) => {
      confirmModalType.value = "delete";
      currentCouponId.value = id;
      confirmPopup.value.open("center");
    };
    const closeConfirmModal = () => {
      confirmPopup.value.close();
      currentCouponId.value = null;
    };
    const confirmAction = async () => {
      if (!currentCouponId.value)
        return;
      let success = false;
      if (confirmModalType.value === "complete") {
        success = await couponStore.completeCoupon(currentCouponId.value);
        if (success) {
          common_vendor.index.showToast({
            title: "兑现成功！",
            icon: "success"
          });
        }
      } else {
        success = await couponStore.deleteCoupon(currentCouponId.value);
        if (success) {
          common_vendor.index.showToast({
            title: "删除成功",
            icon: "success"
          });
        }
      }
      closeConfirmModal();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.name),
            b: activeTab.value === index
          }, activeTab.value === index ? {} : {}, {
            c: index,
            d: activeTab.value === index ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value = index, index)
          });
        }),
        b: common_vendor.o(openCreateModal),
        c: activeTabCoupons.value.length > 0
      }, activeTabCoupons.value.length > 0 ? {
        d: common_vendor.f(activeTabCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(coupon.title),
            b: common_vendor.t(formatDate(coupon.createTime)),
            c: coupon.description
          }, coupon.description ? {
            d: common_vendor.t(coupon.description)
          } : {}, activeTab.value === 0 ? {
            e: common_vendor.t(coupon.creatorNickname)
          } : {}, activeTab.value === 1 ? {
            f: common_vendor.t(coupon.receiverNickname)
          } : {}, activeTab.value === 2 ? {
            g: common_vendor.t(coupon.creatorNickname),
            h: common_vendor.t(coupon.receiverNickname),
            i: common_vendor.t(formatDate(coupon.completeTime))
          } : {}, activeTab.value !== 2 ? {
            j: common_vendor.o(($event) => handleComplete(coupon.id), coupon.id),
            k: common_vendor.o(($event) => handleDelete(coupon.id), coupon.id)
          } : {}, {
            l: coupon.id
          });
        }),
        e: activeTab.value === 0,
        f: activeTab.value === 1,
        g: activeTab.value === 2,
        h: activeTab.value !== 2
      } : {
        i: common_vendor.t(tabs[activeTab.value].name)
      }, {
        j: common_vendor.n("bg-" + activeTab.value),
        k: newCoupon.value.title,
        l: common_vendor.o(($event) => newCoupon.value.title = $event.detail.value),
        m: newCoupon.value.description,
        n: common_vendor.o(($event) => newCoupon.value.description = $event.detail.value),
        o: common_vendor.o(closeCreateModal),
        p: common_vendor.o(confirmCreate),
        q: !newCoupon.value.title,
        r: common_vendor.sr(createPopup, "96ba783d-0", {
          "k": "createPopup"
        }),
        s: common_vendor.p({
          type: "center",
          ["background-color"]: "#fff"
        }),
        t: common_vendor.t(confirmModalType.value === "complete" ? "完成兑现" : "删除兑换券"),
        v: common_vendor.t(confirmModalType.value === "complete" ? "确定要完成兑现这张兑换券吗？" : "确定要删除这张兑换券吗？"),
        w: common_vendor.o(closeConfirmModal),
        x: common_vendor.n(confirmModalType.value === "complete" ? "complete-btn" : "delete-btn"),
        y: common_vendor.o(confirmAction),
        z: common_vendor.sr(confirmPopup, "96ba783d-1", {
          "k": "confirmPopup"
        }),
        A: common_vendor.p({
          type: "center",
          ["background-color"]: "#fff"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96ba783d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupon/coupon.js.map
