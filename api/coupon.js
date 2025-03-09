import { http } from '@/utils/http'

// 兑换券相关API封装
export const couponApi = {
    // 获取所有状态的兑换券
    getCoupons() {
        return http.get('/api/coupons')
    },

    // 创建兑换券
    createCoupon(data) {
        return http.postJSON('/api/coupons', data)
    },

    // 完成兑换券
    completeCoupon(id) {
        return http.put(`/api/coupons/${id}/complete`)
    },

    // 删除兑换券
    deleteCoupon(id) {
        return http.delete(`/api/coupons/${id}`)
    }
}