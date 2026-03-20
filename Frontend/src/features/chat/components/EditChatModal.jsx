import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const EditChatModal = ({ chatTitle, onClose, onSave }) => {
    const { isDarkMode } = useSelector((state) => state.chat)
    const [name, setName] = useState(chatTitle || '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (name.trim() && !saving) {
            setSaving(true)
            await onSave(name.trim())
            setSaving(false)
        }
    }

    const handleKeyDown = (e) => {
        if (saving) return
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={saving ? undefined : onClose}
        >
            {/* Backdrop */}
            <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-black/60' : 'bg-black/20'}`} />

            {/* Modal Card */}
            <div
                className={`relative w-full max-w-md mx-4 border rounded-2xl shadow-2xl p-6 transition-all duration-300 ${isDarkMode ? 'bg-[#151c28] border-white/10 shadow-black/50' : 'bg-white border-black/10 shadow-[0_0_40px_-5px_rgba(0,0,0,0.1)]'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Chat Name</h2>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className={`transition-colors cursor-pointer p-1 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'} ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Label */}
                <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Chat Name
                </label>

                {/* Input */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    disabled={saving}
                    className={`w-full text-sm py-3 px-4 rounded-lg outline-none border transition-colors mb-6 focus:border-[#1a8cd8]/50 ${isDarkMode ? 'bg-[#1b2432] text-white border-white/5' : 'bg-gray-50 text-gray-900 border-gray-200'} ${saving ? 'opacity-50' : ''}`}
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className={`px-5 py-2 text-sm border rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-gray-300 hover:text-white border-white/10 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50'} ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-5 py-2 text-sm font-medium text-white bg-[#1a8cd8] hover:bg-[#1270b0] transition-colors rounded-lg cursor-pointer ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditChatModal