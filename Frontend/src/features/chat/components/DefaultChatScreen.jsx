import React from 'react'

const DefaultChatScreen = ({ inputValue, onChange, onSend, isDarkMode }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
        }
    }

    return (
        <main className="flex-1 flex flex-col h-full min-w-0">
            {/* Centered greeting */}
            <div className="flex-1 relative flex flex-col items-center justify-center px-6">
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#22d3ee] to-[#34d399] flex items-center justify-center mb-6 shadow-lg shadow-[#22d3ee]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 18V5" />
                            <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
                            <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
                            <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
                            <path d="M18 18a4 4 0 0 0 2-7.464" />
                            <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
                            <path d="M6 18a4 4 0 0 1-2-7.464" />
                            <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
                        </svg>
                    </div>
                    <h1 className={`text-4xl font-semibold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        What can I help with?
                    </h1>
                    <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Ask me anything — I'm here to help.
                    </p>
                </div>

                {/* Input field centered */}
                <div className="w-full absolute bottom-5 max-w-3xl">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className={`w-full py-4 pl-5 pr-14 rounded-xl text-sm outline-none transition-colors border focus:border-[#1a8cd8]/50 ${isDarkMode ? 'bg-[#1b2432] text-white placeholder-gray-500 border-white/5' : 'bg-white text-gray-900 placeholder-gray-400 border-black/10 shadow-lg shadow-black/5'}`}
                    />
                    <button
                        onClick={onSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a8cd8] hover:bg-[#1270b0] rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 12V4M4 7l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </main>
    )
}

export default DefaultChatScreen
