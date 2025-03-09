import {defineStore} from 'pinia'
import {ref} from "vue";
import {createSubAlbum, deleteSubAlbum, getSubAlbums, updateSubAlbum} from "/api/album.js"



export const useAlbumStore = defineStore('album', () => {

    const id_index = ref({
        id:null,
        index: null
    })

    const albumList = ref()

    const getAlbumList = async () => {
        try {
            const res = await getSubAlbums()
            console.log("getAlbumList收到的数据", res.data)
            return res.data
        } catch (error) {
            console.error('获取相册信息失败:', error)
        }

    }

    const createNewAlbum = async (name) => {
        try {
            const res = await createSubAlbum(name)
            console.log("createNewAlbum", res.data)
            return res.data
        } catch (error) {
            console.error('创建相册失败:', error)
        }

    }
    const updateAlbum = async (id,name) => {
        try {
            const res = await updateSubAlbum(id, name)
            console.log("updateSubAlbum", res.data)
            return res.data
        } catch (error) {
            console.error('修改相册失败:', error)
        }
    }
    const deleteAlbum = async (id) => {
        try {
            const res = await deleteSubAlbum(id)
            console.log("updateSubAlbum", res.data)
            return res.data
        } catch (error) {
            console.error('修改相册失败:', error)
        }
    }



    return {
        getAlbumList,
        createNewAlbum,
        updateAlbum,
        deleteAlbum,
        id_index


    }
})
