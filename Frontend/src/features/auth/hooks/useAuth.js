import { registerAPI, loginAPI, getMeAPI, sendResetLinkAPI, resetPasswordAPI, logoutAPI } from "../services/auth.api.js"
import { useDispatch } from "react-redux"
import { setUser, setLoading, setError, setSuccess } from "../auth.slice"

export const useAuth = () => {
    const dispatch = useDispatch()

    const register = async ({ username, email, password }) => {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            await registerAPI({ username, email, password })
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const login = async ({ email, password }) => {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            const response = await loginAPI({ email, password })
            dispatch(setUser(response.user))
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const logout = async () => {
        try{
            dispatch(setError(null))
            dispatch(setLoading(true))
            await logoutAPI()
            dispatch(setUser(null))
            return true;
        }catch(error){
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const sendResetLink = async ({email}) => {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            await sendResetLinkAPI({email})
            dispatch(setSuccess("Reset link sent successfully"))
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const resetPassword = async ({token, newPassword}) => {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            await resetPasswordAPI({token, newPassword})
            dispatch(setSuccess("Password reset successfully"))
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const getMe = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getMeAPI()
            dispatch(setUser(response.user))
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        register,
        login,
        logout,
        getMe,
        sendResetLink,
        resetPassword
    }
}