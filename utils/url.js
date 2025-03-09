// const BASE_URL = 'http://localhost:8080'
const BASE_URL = 'https://xinliang.fun/api/wx'

export const getAvatarUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const normalizedUrl = url.replace(/\\/g, '/')

    // 如果是相对路径的资源，通过Nginx访问
    return `${BASE_URL}${normalizedUrl}`
}