const Skeleton = ({ isDarkMode }) => {
    const shimmerStyle = isDarkMode ? {
        backgroundImage: 'linear-gradient(90deg, #1b2432 25%, #253245 50%, #1b2432 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
    } : {
        backgroundImage: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
    }

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            <div className="flex justify-start mb-6">
                <div className={`rounded-2xl max-w-2xl w-full p-6 ${isDarkMode ? 'bg-[#151c28] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
                    {/* Answer Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-linear-to-r from-[#22d3ee] to-[#34d399] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
                        <span className={`font-semibold text-sm tracking-wide uppercase font-mono ${isDarkMode ? 'text-[#34d399]' : 'text-[#1a8cd8]'}`}>Answer</span>
                    </div>

                    {/* Shimmer lines - paragraph 1 */}
                    <div className="space-y-2.5 mb-5">
                        <div className="h-3 rounded-full w-[95%]" style={shimmerStyle}></div>
                        <div className="h-3 rounded-full w-full" style={shimmerStyle}></div>
                        <div className="h-3 rounded-full w-[85%]" style={shimmerStyle}></div>
                        <div className="h-3 rounded-full w-[90%]" style={shimmerStyle}></div>
                        <div className="h-3 rounded-full w-[60%]" style={shimmerStyle}></div>
                    </div>

                    {/* Shimmer lines - heading */}
                    <div className="mb-4">
                        <div className="h-4 rounded-full w-[40%]" style={shimmerStyle}></div>
                    </div>

                    {/* Shimmer lines - bullet points */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shrink-0" style={shimmerStyle}></div>
                            <div className="h-3 rounded-full w-[88%]" style={shimmerStyle}></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shrink-0" style={shimmerStyle}></div>
                            <div className="h-3 rounded-full w-[75%]" style={shimmerStyle}></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shrink-0" style={shimmerStyle}></div>
                            <div className="h-3 rounded-full w-[82%]" style={shimmerStyle}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Skeleton