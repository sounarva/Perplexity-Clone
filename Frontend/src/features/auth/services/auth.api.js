import axios from "axios"
const authAPI = axios.create({
    baseURL: "",
    withCredentials: true
})

export const registerAPI = async ({username , email , password}) => {
    const response = await authAPI.post("/api/v1/auth/register" , {
        username,
        email,
        password
    })
    return response.data
}

export const loginAPI = async ({email , password}) => {
    const response = await authAPI.post("/api/v1/auth/login" , {
        email,
        password
    })
    return response.data
}

export const sendResetLinkAPI = async ({email}) => {
    const response = await authAPI.post("/api/v1/auth/reset-password-link" , {
        email
    })
    return response.data
}

export const resetPasswordAPI = async ({token, newPassword}) => {
    const response = await authAPI.post("/api/v1/auth/reset-password" , {
        token,
        newPassword
    })
    return response.data
}

export const logoutAPI = async () => {
    const response = await authAPI.get("/api/v1/auth/logout")
    return response.data
}

export const getMeAPI = async () => {
    const response = await authAPI.get("/api/v1/auth/me")
    return response.data
}