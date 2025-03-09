// 管理登录
// 储存token，返回用户主页渲染内容

import {defineStore} from 'pinia'
import {ref} from "vue";
import {loginAPI, updateUserProfileAPI, getUserInfoAPI} from "/api/user.js"


export const useUserStore = defineStore('user', () => {
    const userInfo = ref([])
    const sessionKey = ref('')

    const getUserInfo = async () => {
        try {
            const res = await getUserInfoAPI()
            console.log("pinia中第一时间收到的数据", res.data)
            return res.data
        } catch (error) {
            console.error('获取用户信息失败:', error)
        }

    }
    const login = async () => {
        try {
            // 获取登录code
            const loginResult = await uni.login()
            console.log(loginResult.code)

            // 调用登录接口
            const res = await loginAPI(loginResult.code)

            // 存储返回数据
            sessionKey.value = res.data.sessionKey
            userInfo.value = res.data.userInfo
            console.log("res", res)

            // 储存token到本地
            uni.setStorageSync('token', res.data.token)
            uni.setStorageSync('main album', res.data.userInfo[0].mainAlbumsId)

            return {success: true}
        } catch (error) {
            console.error('登录失败：', error)
            uni.showToast({
                title: '登录失败',
                icon: 'none'
            })
            return {success: false, error}
        }
    }


    // 获取存储的信息
    const getStoredInfo = () => {
        console.log(userInfo.value[0].avatarUrl)
        return {userInfo: userInfo.value}
    }

    const updateProfile = async (profileData) => {
        try {
            const updateData = {
                nickname: profileData.nickname?.trim(),
                partner_id: profileData.partner_id ? String(profileData.partner_id).trim() : '',
                avatarFile: profileData.avatarFile
            }
            console.log("store:updateData", updateData)
            const res = await updateUserProfileAPI(updateData)

            if (res?.data?.userInfo) {
                userInfo.value = res.data.userInfo
            }
            return {success: true, data: res.data}
        } catch (error) {
            console.error('更新个人资料失败:', error)
            // 错误已在 API 层处理，这里不需要重复显示 Toast
            return {success: false, error: error.message || '更新失败'}
        }
    }

    return {
        sessionKey,
        userInfo,
        login,
        getStoredInfo,
        updateProfile,
        getUserInfo
    }
})
