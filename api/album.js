import {http} from '@/utils/http.js'


// 创建子相册
export function createSubAlbum(name) {
    return http.postForm('/sub-albums', { name })
}

// 删除子相册
export function deleteSubAlbum(id) {
    return http.delete(`/sub-albums/${id}`)
}

// 修改子相册名称
export function updateSubAlbum(id, name) {
    // 将参数作为查询参数附加到URL上 - 适用于@RequestParam
    return http.put(`/sub-albums/${id}?name=${encodeURIComponent(name)}`)
}

// 获取当前用户的所有子相册
export function getSubAlbums() {
    return http.get('/sub-albums/list')
}