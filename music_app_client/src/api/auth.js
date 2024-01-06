import instance from "../axios_instance";


export const Auth = {
    signIn: async (data) => {
        const url = '/api/user/signin'
        const response = await instance.post(url, { account: data.account, password: data.password })
        if (response.success) {
            localStorage.setItem('musicApp', JSON.stringify({ accessToken: response.accessToken, authToken: response.authToken, loging: true }))
        }
        return response
    },
    signUp: async (data) => {
        const url = '/api/user/signup'
        const response = await instance.post(url, { ...data })
        return response
    },
    getUser: async () => {
        const url = '/api/user'
        const response = await instance.get(url)
        return response
    },
    getOTP: async (data) => {
        const url = '/api/user/get_otp'
        const response = await instance.post(url, data)
        return response
    },
    verifyOTP: async (data) => {
        const url = '/api/user/verify_otp'
        const response = await instance.post(url, data)
        return response
    }
}