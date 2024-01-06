import instance from "../axios_instance";


export const Artist = {
    get: async (query) => {
        const url = '/api/artist/'
        const response = await instance.get(url, {
            params: query
        })
        return response
    },
    getOne: async (query) => {
        const url = '/api/artist/id'
        const response = await instance.get(url, {
            params: query
        })
        return response
    },
}