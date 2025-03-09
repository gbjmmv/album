const isDev = process.env.NODE_ENV === 'development'
//const baseURL = isDev ? 'http://localhost:8080' : ''  // 生产环境URL待定

const baseURL = 'https://xinliang.fun/api/wx'
//const baseURL = 'http://1.95.63.156:8080'


// 创建请求对象
const httpRequest = {
    config: {
        baseURL,
        header: {
            'Content-Type': 'application/json'
        },
        timeout: 10000,
    },

    // 请求拦截
    requestInterceptor(options) {
        options.header = options.header || {};
        const token = uni.getStorageSync('token')
        if (token) {
            options.header.Authorization = `Bearer ${token}`
        }
        options.url = baseURL + options.url
        return options
    },

    // 响应拦截
    responseInterceptor(response) {
        const { statusCode, data } = response

        if (statusCode >= 200 && statusCode < 300) {
            return data
        }

        if (statusCode === 401) {
            const userStore = useUserStore()
            userStore.clearUserInfo()
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }

        uni.showToast({
            title: data.message || '请求失败',
            icon: 'none'
        })

        return Promise.reject(response)
    },

    // 请求方法
    request(options = {}) {
        options = { ...this.config, ...options }
        options = this.requestInterceptor(options)

        return new Promise((resolve, reject) => {
            options.success = (response) => {
                try {
                    const res = this.responseInterceptor(response)
                    resolve(res)
                } catch (error) {
                    reject(error)
                }
            }
            options.fail = (error) => {
                uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                })
                reject(error)
            }
            uni.request(options)
        })
    },

    upload(options = {}) {
        const { url, filePath, formData = {} } = options;
        const fileList = Array.isArray(filePath) ? filePath : [filePath];

        const token = uni.getStorageSync('token');
        const header = options.header || {};
        if (token) {
            header.Authorization = `Bearer ${token}`;
        }

        // Create an array of upload promises
        const uploadPromises = fileList.map((file, index) => {
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: baseURL + url,
                    filePath: file,
                    name: options.name || 'file', // 使用传入的name参数，默认为'file'
                    formData: { ...formData, fileIndex: index },
                    header,
                    success: (response) => {
                        console.log(`Upload response for file ${index}:`, response);
                        try {
                            const data = JSON.parse(response.data);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    fail: (error) => {
                        console.error(`Upload failed for file ${index}:`, error);
                        uni.showToast({
                            title: `第${index + 1}个文件上传失败`,
                            icon: 'none'
                        });
                        reject(error);
                    }
                });
            });
        });

        // Return all upload results
        return Promise.all(uploadPromises)
            .then(results => {
                // If only one file was uploaded, return just that result
                // Otherwise return the array of results
                return fileList.length === 1 ? results[0] : results;
            })
            .catch(error => {
                console.error('One or more uploads failed:', error);
                throw error;
            });
    }
}

// 导出请求方法
export const http = {
    get(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'GET'
        })
    },

    postJSON(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            }
        });
    },

    // 发送表单数据的 POST 请求
    postForm(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
    },

    // 新增的PUT方法 - JSON格式
    put(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'PUT',
            header: {
                'content-type': 'application/json'
            }
        });
    },

    // 新增的PUT方法 - 表单格式
    putForm(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'PUT',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });
    },

    // 新增的DELETE方法
    delete(url, data = {}, options = {}) {
        return httpRequest.request({
            ...options,
            url,
            data,
            method: 'DELETE'
        });
    },

    upload(url, filePath, formData = {}, options = {}) {
        return httpRequest.upload({
            url,
            filePath,
            name: options.name || 'file',
            formData,
            ...options
        })
    }
}