import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useDispatch } from 'react-redux'
import { addNewMessage, addNewChat, setCurrentChatId, toggleDarkMode } from '../chat.slice'
import DefaultChatScreen from '../components/DefaultChatScreen'
import Skeleton from '../components/Skeleton'
import Logout from '../../../shared/Logout'
import remarkGfm from 'remark-gfm';
import DeleteChatModal from '../components/DeleteChatModal'
import EditChatModal from '../components/EditChatModal'
import { useAuth } from '../../auth/hooks/useAuth'
import { useNavigate } from 'react-router'
import * as htmlToImage from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'



// ─── Sidebar Component ──────────────────────────────────────────────────────
const Sidebar = ({ user, chats, getMessagesAPI, setIsLogoutModalOpen, editChatAPI, deleteChatAPI, handleNewChat, currentChatId, isDarkMode, onToggleDarkMode, isMobileOpen, setIsMobileOpen }) => {
    const [editChatId, setEditChatId] = useState(null)
    const [deleteChatId, setDeleteChatId] = useState(null)
    const [width, setWidth] = useState(256) // Initial width (equivalent to w-64)
    const isResizing = useRef(false)

    // Resizing logic
    const startResizing = (e) => {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResizing);
    };

    const handleResize = (e) => {
        if (!isResizing.current) return;
        // Constrain the sidebar between 256px and 600px
        const newWidth = Math.max(256, Math.min(e.clientX, 600));
        setWidth(newWidth);
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResizing);
    };

    // Cleanup listeners so we don't cause memory leaks if the component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    const handleOpenChat = async (chatId) => {
        await getMessagesAPI({ chatId })
    }

    const handleChatEdit = (e, chatId) => {
        e.stopPropagation()
        setEditChatId(chatId)
        if (setIsMobileOpen) setIsMobileOpen(false)
    }

    const handleSaveChatName = async (newName) => {
        await editChatAPI({ chatId: editChatId, title: newName })
        setEditChatId(null)
    }

    const handleChatDelete = (e, chatId) => {
        e.stopPropagation()
        setDeleteChatId(chatId)
        if (setIsMobileOpen) setIsMobileOpen(false)
    }

    const handleConfirmDelete = async () => {
        await deleteChatAPI({ chatId: deleteChatId })
        setDeleteChatId(null)
    }
    return (
        <>
            {isMobileOpen !== undefined && (
                <div 
                    className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            {editChatId && (
                <EditChatModal
                    chatTitle={chats[editChatId]?.title || ''}
                    onClose={() => setEditChatId(null)}
                    onSave={handleSaveChatName}
                />
            )}
            {deleteChatId && (
                <DeleteChatModal
                    onClose={() => setDeleteChatId(null)}
                    onDelete={handleConfirmDelete}
                />
            )}
            <aside
                className={`sidebar-container ${isMobileOpen ? 'open' : ''} relative shrink-0 flex flex-col h-full border-r ${isDarkMode ? 'border-white/5 bg-[#0d1117]' : 'border-black/5 bg-[#f9f9f9]'}`}
                style={{ width: `${width}px` }}
            >
                {/* Drag Handle */}
                <div
                    onMouseDown={startResizing}
                    className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[#1a8cd8]/50 z-20 transition-colors group"
                />
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 pt-6 pb-4">
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#1a8cd8]">
                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                    </svg>
                    <span className={`font-semibold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Perplexity</span>
                </div>

                {/* New Thread Button */}
                <div className="px-4 mb-5">
                    <button
                        onClick={handleNewChat}
                        className={`w-full flex items-center justify-between text-sm font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-[#1b2432] hover:bg-[#243044] text-white border border-transparent' : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm'}`}>
                        <span>New Thread</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Recent Activity */}
                <div className="px-5 mb-3">
                    <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Recent Activity</p>
                </div>
                <nav className="flex-1 overflow-y-auto px-3">
                    {Object.values(chats).map((chat, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleOpenChat(chat.id)}
                            className={`group w-full flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-colors text-left cursor-pointer ${currentChatId === chat.id
                                    ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-gray-900 font-medium')
                                    : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5')
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-50">
                                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                            <span className="truncate flex-1">{chat.title}</span>
                            <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-black/10'}`}
                                    onClick={(e) => handleChatEdit(e, chat.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-pen-line"><path d="M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z" /><path d="M14.487 7.858A1 1 0 0 1 14 7V2" /><path d="M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516" /><path d="M8 18h1" /></svg>
                                </button>
                                <button
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-500/10'}`}
                                    onClick={(e) => handleChatDelete(e, chat.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Area */}
                <div className={`px-4 pb-5 pt-3 border-t mt-auto ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={onToggleDarkMode}
                        className={`w-full flex items-center gap-3 text-sm py-2 px-2 rounded-lg transition-colors mb-4 cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-white bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5 bg-black/2'}`}
                    >
                        {isDarkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                        )}
                        <span className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#1b2432]' : 'bg-[#e5e7eb]'}`}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="6" r="3" stroke={isDarkMode ? "#94a3b8" : "#64748b"} strokeWidth="1.5" fill="none" />
                                <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={isDarkMode ? "#94a3b8" : "#64748b"} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.username}</span>
                        <button
                            onClick={() => {
                                setIsLogoutModalOpen(true)
                                if (setIsMobileOpen) setIsMobileOpen(false)
                            }}
                            className={`ml-auto transition-colors cursor-pointer ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

// ─── User Message Bubble ─────────────────────────────────────────────────────
const UserMessage = ({ content, isDarkMode }) => {
    return (
        <div className="flex justify-end mb-6">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className={`py-3 px-5 rounded-2xl text-sm leading-relaxed ${isDarkMode ? 'bg-[#1b2432] text-white' : 'bg-[#f3f4f6] text-gray-900'}`}>
                    {content}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-[#1b2432]' : 'bg-[#e5e7eb]'}`}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="6" r="3" stroke={isDarkMode ? "#94a3b8" : "#64748b"} strokeWidth="1.5" fill="none" />
                        <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={isDarkMode ? "#94a3b8" : "#64748b"} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

// ─── AI Message Bubble ───────────────────────────────────────────────────────
const AiMessage = ({ content, isDarkMode }) => {
    return (
        <div className="flex justify-start mb-6">
            <div className={`rounded-2xl max-w-2xl w-full p-6 ${isDarkMode ? 'bg-[#151c28] border border-white/5' : 'bg-white border border-black/5 shadow-sm'}`}>
                {/* Answer Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#22d3ee] to-[#34d399] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>
                    </div>
                    <span className={`font-semibold text-sm tracking-wide uppercase font-mono ${isDarkMode ? 'text-[#34d399]' : 'text-[#1a8cd8]'}`}>Answer</span>
                </div>

                {/* Message Content */}
                <div className={`text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-ol:my-2 prose-ul:my-2 prose-li:my-0.5 prose-a:text-[rgb(26,140,216)] ${isDarkMode ? 'text-gray-300 prose-invert prose-headings:text-white prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-white prose-code:text-[#22d3ee] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0' : 'text-gray-800 prose-headings:text-gray-900 prose-headings:mt-4 prose-headings:mb-2 prose-strong:text-gray-900 prose-code:text-[#1a8cd8] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0'}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        {...props}
                                        style={isDarkMode ? vscDarkPlus : vs}
                                        language={match[1]}
                                        PreTag="div"
                                        className="rounded-lg my-4! border border-black/10 dark:border-white/10"
                                        showLineNumbers={true}
                                        customStyle={{
                                            fontSize: '1rem',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code {...props} className={className}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

// ─── Chat Input Component ────────────────────────────────────────────────────
const ChatInput = ({ value, onChange, onSend, isDarkMode }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
        }
    }

    return (
        <div className={`sticky bottom-0 w-full px-6 pb-5 pt-3 bg-linear-to-t from-60% to-transparent ${isDarkMode ? 'from-[#0f1923]' : 'from-[#ffffff]'}`}>
            <div className="max-w-3xl mx-auto relative">
                <input
                    type="text"
                    value={value}
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
    )
}

// ─── Main Dashboard Component ────────────────────────────────────────────────
const Dashboard = () => {
    const { user } = useSelector((state) => state.auth)
    const { chats, currentChatId, loading, isDarkMode } = useSelector((state) => state.chat)
    const { logout } = useAuth()
    const { sendMessageAPI, getChatsAPI, getMessagesAPI, editChatAPI, deleteChatAPI } = useChat()
    const { initializeSocketConnection, setupStreamListener } = useChat()
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef(null)
    const prevMsgCountRef = useRef(0)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        initializeSocketConnection()
        setupStreamListener()
        const fetchChats = async () => {
            await getChatsAPI()
        }
        fetchChats()
    }, [])

    // Auto-scroll to prevent stream jitter
    useEffect(() => {
        const currentMsgs = chats[currentChatId]?.messages || [];
        const scrollBehavior = currentMsgs.length > prevMsgCountRef.current ? 'smooth' : 'auto';
        messagesEndRef.current?.scrollIntoView({ behavior: scrollBehavior });
        prevMsgCountRef.current = currentMsgs.length;
    }, [chats[currentChatId]?.messages])

    const handleSend = async () => {
        if (inputValue.trim()) {
            const userMessage = inputValue
            setInputValue('')
            let activeChatId = currentChatId
            let tempId = null

            if (!currentChatId) {
                tempId = `temp-${Date.now()}`
                dispatch(addNewChat({
                    chatId: tempId,
                    title: "New Chat"
                }))
                dispatch(addNewMessage({
                    chatId: tempId,
                    content: userMessage,
                    type: "user"
                }))
                dispatch(setCurrentChatId(tempId))
                activeChatId = tempId
            } else {
                dispatch(addNewMessage({
                    chatId: currentChatId,
                    content: userMessage,
                    type: "user"
                }))
            }

            await sendMessageAPI({ message: userMessage, chatId: currentChatId, tempChatId: tempId })
        }
    }

    const handleLogout = async () => {
        await logout()
        dispatch(setCurrentChatId(null))
        setIsLogoutModalOpen(false)
        navigate("/login")
    }

    const handleNewChat = () => {
        dispatch(setCurrentChatId(null))
    }

    const handleExportPDF = async () => {
        if (!currentChatId) return;
        setIsExporting(true);
        try {
            const input = document.getElementById('chat-export-container');
            if (!input) return;

            // Temporarily disable scrollbar to capture the full height
            const originalHeight = input.style.height;
            const originalOverflow = input.style.overflow;
            input.style.height = 'max-content';
            input.style.overflow = 'visible';

            // html-to-image handles modern CSS (like Tailwind oklab) flawlessly
            const imgData = await htmlToImage.toPng(input, {
                pixelRatio: 2,
                backgroundColor: '#0f1923',
            });

            // Restore styles
            input.style.height = originalHeight;
            input.style.overflow = originalOverflow;

            // Create a dummy image element to read its dimensions
            const img = new Image();
            img.src = imgData;
            await new Promise((resolve) => { img.onload = resolve; });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (img.height * pdfWidth) / img.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            const chatTitle = chats[currentChatId]?.title || 'Chat';
            pdf.save(`${chatTitle}.pdf`);

        } catch (error) {
            console.error("Failed to export PDF:", error);
        } finally {
            setIsExporting(false);
        }
    }

    const handleToggleTheme = () => {
        if (!document.startViewTransition) {
            dispatch(toggleDarkMode())
            return
        }
        document.startViewTransition(() => {
            dispatch(toggleDarkMode())
        })
    }

    return (
        <div className={`dashboard-container flex flex-col h-screen w-full overflow-hidden transition-colors duration-0 ${isDarkMode ? 'bg-[#0f1923]' : 'bg-[#ffffff]'}`}>
            {/* Mobile Top Bar */}
            <nav className={`mobile-top-bar w-full shrink-0 flex items-center justify-between px-4 py-3 border-b md:hidden ${isDarkMode ? 'bg-[#0f1923] border-white/5' : 'bg-[#ffffff] border-black/5'}`}>
                <div className="flex items-center gap-3">
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1a8cd8]">
                        <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
                    </svg>
                    <span className={`font-semibold text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Perplexity</span>
                </div>
                <div className="flex items-center gap-2">
                    {currentChatId && (
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className={`text-[11px] sm:text-xs font-medium py-1.5 px-2.5 rounded-md border shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${isDarkMode ? 'bg-[#1b2432] hover:bg-[#243044] text-gray-300 hover:text-white border-white/5' : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border-black/10'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            {isExporting ? 'Saving...' : 'Save PDF'}
                        </button>
                    )}
                    <button 
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className={`p-2 rounded-md transition-colors cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </nav>

            {/* Inner row container for Sidebar and Main content */}
            <div className="flex-1 flex overflow-hidden relative">

            {isLogoutModalOpen && (
                <Logout
                    onClose={() => setIsLogoutModalOpen(false)}
                    handleLogout={handleLogout}
                />
            )}
            {/* Sidebar */}
            <Sidebar
                user={user}
                chats={chats}
                getMessagesAPI={getMessagesAPI}
                setIsLogoutModalOpen={setIsLogoutModalOpen}
                editChatAPI={editChatAPI}
                deleteChatAPI={deleteChatAPI}
                handleNewChat={handleNewChat}
                currentChatId={currentChatId}
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleTheme}
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />

            {/* Main Chat Area */}
            {!currentChatId ? (
                <DefaultChatScreen
                    inputValue={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    isDarkMode={isDarkMode}
                />
            ) : (
                <main className="relative flex-1 flex flex-col h-full min-w-0 z-0">

                    {/* Save to PDF Button (Desktop View) */}
                    <div className="hidden md:block absolute top-4 left-6 z-10">
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className={`text-xs font-medium py-2 px-3 rounded-md border shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ${isDarkMode ? 'bg-[#1b2432] hover:bg-[#243044] text-gray-300 hover:text-white border-white/5' : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border-black/10'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            {isExporting ? 'Saving...' : 'Save as PDF'}
                        </button>
                    </div>

                    {/* Scrollable Messages Area */}
                    <div id="chat-export-container" className={`flex-1 overflow-y-auto px-6 pt-16 custom-scrollbar transition-colors duration-0 ${isDarkMode ? 'bg-[#0f1923]' : 'bg-[#ffffff]'}`}>
                        <div className="max-w-3xl mx-auto">
                            {chats[currentChatId]?.messages?.map((msg, index) =>
                                msg.type === 'user' ? (
                                    <UserMessage key={index} content={msg.content} isDarkMode={isDarkMode} />
                                ) : (
                                    <AiMessage key={index} content={msg.content} isDarkMode={isDarkMode} />
                                )
                            )}
                            {loading && <Skeleton isDarkMode={isDarkMode} />}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Fixed Input at Bottom */}
                    <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} isDarkMode={isDarkMode} />
                </main>
            )}
            </div>
        </div>
    )
}

export default Dashboard