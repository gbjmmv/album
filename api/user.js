import {http} from '@/utils/http.js'

export const loginAPI = (code) => {
    return http.postJSON('/user/login', {
        code: code
    })
}

export const getUserInfoAPI = () => {
    return http.get('/user/info');
}

export const updateUserProfileAPI = async (profileData) => {
    try {
        const {nickname, partner_id, avatarFile} = profileData;
        const formData = {};
        if (nickname?.trim()) {
            formData.nickname = nickname.trim();
        }
        if (partner_id && String(partner_id).trim()) {
            formData.partner_id = String(partner_id).trim();
        }
        const API_ENDPOINT = '/user/profile/update';
        if (avatarFile) {
            const uploadConfig = {
                header: {
                    'Content-Type': 'multipart/form-data'
                },
                name: 'avatar'
            };
            return http.upload(API_ENDPOINT, avatarFile, formData, uploadConfig);
        }else{
            return http.postForm(API_ENDPOINT, formData);
        }
        throw new Error('没有有效的更新数据');
    } catch (error) {
        console.error('更新个人资料失败:', error);
        uni.showToast({
            title: error.message || '更新失败，请重试',
            icon: 'none'
        });
        throw error;
    }
};
