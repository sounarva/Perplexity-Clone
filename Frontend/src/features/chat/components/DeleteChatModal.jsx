import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const DeleteChatModal = ({ onClose, onDelete }) => {
    const { isDarkMode } = useSelector((state) => state.chat)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!deleting) {
            setDeleting(true)
            await onDelete()
            setDeleting(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={deleting ? undefined : onClose}
        >
            {/* Backdrop */}
            <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-black/60' : 'bg-black/20'}`} />

            {/* Modal Card */}
            <div
                className={`relative w-[90%] max-w-[320px] border rounded-2xl shadow-2xl p-5 md:p-6 text-center transition-all duration-300 ${isDarkMode ? 'bg-[#151c28] border-white/10 shadow-black/50' : 'bg-white border-black/10 shadow-[0_0_40px_-5px_rgba(0,0,0,0.1)]'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Red Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-500/15' : 'bg-red-50'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delete Chat?</h2>

                {/* Description */}
                <p className={`text-[13px] leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Are you sure you want to delete this chat? This action cannot be undone.
                </p>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`w-full py-2.5 text-[13px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors cursor-pointer mb-2 ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>

                {/* Cancel Button */}
                <button
                    onClick={onClose}
                    disabled={deleting}
                    className={`w-full py-2 text-[13px] font-medium transition-colors cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default DeleteChatModal