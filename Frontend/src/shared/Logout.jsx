import { useSelector } from 'react-redux'

const Logout = ({ onClose, handleLogout }) => {
    const { isDarkMode } = useSelector((state) => state.chat)

    return (
        /* Backdrop overlay */
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-300 ${isDarkMode ? 'bg-black/60' : 'bg-black/20'}`}>
            {/* Modal card */}
            <div className={`border rounded-2xl px-6 py-7 w-[90%] max-w-[340px] flex flex-col items-center shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-[#111a25] border-white/10 shadow-black/50' : 'bg-white border-black/10 shadow-[0_0_40px_-5px_rgba(0,0,0,0.1)]'}`}>
                {/* Logout icon */}
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-5 ${isDarkMode ? 'bg-[#1b2432] border-white/10' : 'bg-gray-50 border-black/5'}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    </svg>
                </div>

                {/* Text */}
                <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Logout</h2>
                <p className={`text-[13px] leading-relaxed text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Are you sure you want to log out of your account?
                </p>

                {/* Buttons */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={() => onClose()}
                        className={`flex-1 py-2.5 rounded-xl border text-[13px] font-medium transition-colors cursor-pointer ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 py-2.5 rounded-xl bg-[#1a8cd8] text-white text-[13px] font-medium hover:bg-[#1270b0] transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Logout