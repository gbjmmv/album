"use strict";
const common_vendor = require("../common/vendor.js");
const baseURL = "http://localhost:8080";
const httpRequest = {
  config: {
    baseURL,
    header: {
      "Content-Type": "application/json"
    },
    timeout: 1e4
  },
  // 请求拦截
  requestInterceptor(options) {
    options.header = options.header || {};
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      options.header.Authorization = `Bearer ${token}`;
    }
    options.url = baseURL + options.url;
    return options;
  },
  // 响应拦截
  responseInterceptor(response) {
    const { statusCode, data } = response;
    if (statusCode >= 200 && statusCode < 300) {
      return data;
    }
    if (statusCode === 401) {
      const userStore = useUserStore();
      userStore.clearUserInfo();
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
    common_vendor.index.showToast({
      title: data.message || "请求失败",
      icon: "none"
    });
    return Promise.reject(response);
  },
  // 请求方法
  request(options = {}) {
    options = { ...this.config, ...options };
    options = this.requestInterceptor(options);
    return new Promise((resolve, reject) => {
      options.success = (response) => {
        try {
          const res = this.responseInterceptor(response);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      };
      options.fail = (error) => {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        reject(error);
      };
      common_vendor.index.request(options);
    });
  },
  upload(options = {}) {
    const { url, filePath, formData = {} } = options;
    const fileList = Array.isArray(filePath) ? filePath : [filePath];
    const token = common_vendor.index.getStorageSync("token");
    const header = options.header || {};
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }
    const uploadPromises = fileList.map((file, index) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          url: baseURL + url,
          filePath: file,
          name: options.name || "file",
          // 使用传入的name参数，默认为'file'
          formData: { ...formData, fileIndex: index },
          header,
          success: (response) => {
            common_vendor.index.__f__("log", "at utils/http.js:96", `Upload response for file ${index}:`, response);
            try {
              const data = JSON.parse(response.data);
              resolve(data);
            } catch (error) {
              reject(error);
            }
          },
          fail: (error) => {
            common_vendor.index.__f__("error", "at utils/http.js:105", `Upload failed for file ${index}:`, error);
            common_vendor.index.showToast({
              title: `第${index + 1}个文件上传失败`,
              icon: "none"
            });
            reject(error);
          }
        });
      });
    });
    return Promise.all(uploadPromises).then((results) => {
      return fileList.length === 1 ? results[0] : results;
    }).catch((error) => {
      common_vendor.index.__f__("error", "at utils/http.js:124", "One or more uploads failed:", error);
      throw error;
    });
  }
};
const http = {
  get(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "GET"
    });
  },
  postJSON(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "POST",
      header: {
        "content-type": "application/json"
      }
    });
  },
  // 发送表单数据的 POST 请求
  postForm(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });
  },
  put(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "PUT",
      header: {
        "content-type": "application/json"
      }
    });
  },
  putForm(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "PUT",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    });
  },
  delete(url, data = {}, options = {}) {
    return httpRequest.request({
      ...options,
      url,
      data,
      method: "DELETE"
    });
  },
  upload(url, filePath, formData = {}, options = {}) {
    return httpRequest.upload({
      url,
      filePath,
      name: options.name || "file",
      formData,
      ...options
    });
  }
};
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/http.js.map
