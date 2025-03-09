// src/stores/coupon.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { couponApi } from '@/api/coupon'

export const useCouponStore = defineStore('coupon', () => {
    // 状态
    const pendingUse = ref([]) // 待使用的券（我收到的）
    const pendingRedeem = ref([]) // 待兑现的券（我创建的）
    const completed = ref([]) // 已完成的券
    const loading = ref(false)

    // 获取所有兑换券并分类
    const fetchCoupons = async () => {
        loading.value = true
        try {
            const result = await couponApi.getCoupons()
            console.log("result.data.pendingRedeem:",result.data.pendingRedeem)
            if (result.code === 0) {
                pendingUse.value = result.data.pendingUse || []
                pendingRedeem.value = result.data.pendingRedeem || []
                completed.value = result.data.completed || []
            }
        } catch (error) {
            console.error('获取兑换券失败:', error)
            uni.showToast({
                title: '获取兑换券失败',
                icon: 'none'
            })
        } finally {
            loading.value = false
        }
    }

    // 创建兑换券
    const createCoupon = async (couponData) => {
        try {
            console.log('createCoupon:', couponData)
            const result = await couponApi.createCoupon(couponData)
            if (result.code === 0) {
                await fetchCoupons() // 刷新列表
                return true
            }
            return false
        } catch (error) {
            console.error('创建兑换券失败:', error)
            uni.showToast({
                title: '创建兑换券失败',
                icon: 'none'
            })
            return false
        }
    }

    // 完成兑换券
    const completeCoupon = async (id) => {
        try {
            const result = await couponApi.completeCoupon(id)
            if (result.code === 0) {
                await fetchCoupons() // 刷新列表
                return true
            }
            return false
        } catch (error) {
            console.error('完成兑换券失败:', error)
            uni.showToast({
                title: '完成兑换券失败',
                icon: 'none'
            })
            return false
        }
    }

    // 删除兑换券
    const deleteCoupon = async (id) => {
        try {
            const result = await couponApi.deleteCoupon(id)
            if (result.code === 0) {
                await fetchCoupons() // 刷新列表
                return true
            }
            return false
        } catch (error) {
            console.error('删除兑换券失败:', error)
            uni.showToast({
                title: '删除兑换券失败',
                icon: 'none'
            })
            return false
        }
    }

    return {
        pendingUse,
        pendingRedeem,
        completed,
        loading,
        fetchCoupons,
        createCoupon,
        completeCoupon,
        deleteCoupon
    }
})