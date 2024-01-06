import instance from "../axios_instance";
export * from './category'
export * from './auth'
export * from './artist'
export * from './music'
export const Extend = {
    search: async (data) => {
        const url = '/api/search'
        const response = await instance.get(url, { params: data })
        return response
    },
    upgratePlant: async (data) => {
        const url = '/api/user/upgrate_plant'
        const response = await instance.get(url)
        return response
    },
}