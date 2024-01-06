import instance from "../axios_instance";

export const Category = {
    getAll: async () => {
        const url = '/api/categories'
        const response = await instance.get(url)
        return response
    }
}