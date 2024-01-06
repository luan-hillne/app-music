import instance from "../axios_instance";


export const Musuc = {
    getTop: async (query) => {
        const url = '/api/music/list'
        const response = await instance.get(url, {
            params: query
        })
        return response
    },
    getCate: async (query) => {
        const url = '/api/music/cate'
        const response = await instance.get(url, {
            params: query
        })
        return response
    },
    get: async (query) => {
        const url = '/api/music/'
        const response = await instance.get(url, {
            params: query
        })
        return response
    },
}