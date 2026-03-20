import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../../../shared/loader'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth)
    if (loading) {
        return <Loader />
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected