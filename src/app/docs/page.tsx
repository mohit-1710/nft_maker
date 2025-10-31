"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Search, MessageCircle, BookOpen, Zap, Lock, Menu, X, ChevronRight, Send, ThumbsUp, ThumbsDown, Copy, RefreshCw, Trash2, Minimize2, Sparkles } from "lucide-react"
import { MarkdownRenderer } from "../components/MarkDownRenderer"

// Chat message interface
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const docsSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    slug: "getting-started",
    description: "Complete guide to setting up and using Solana Token Launchpad"
  },
  {
    id: "trading-guide",
    title: "Trading Guide",
    icon: Zap,
    slug: "trading-guide",
    description: "Master token creation, NFT minting, and platform features"
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    icon: Lock,
    slug: "privacy-security",
    description: "Best practices for wallet security and safe token creation"
  }
];

/**
 * Docs Page with Fixed Sidebar Navigation & AI-Powered Chatbot
 * 
 * Layout Structure:
 * - Desktop: Fixed left sidebar (250px) + scrollable main content
 * - Mobile: Collapsible sidebar (hamburger menu)
 * 
 * Chatbot States:
 * 1. COLLAPSED: Bottom-center pill input
 * 2. FOCUSED: Slightly expanded input with hint
 * 3. EXPANDED: Full right-side chat panel with messages
 * 
 * Features:
 * - Active section highlighting
 * - Gemini AI responses based on documentation content
 * - Chat history management with context retention
 * - Regenerate responses with AI
 * - Smooth state transitions
 * - Enhanced typography and dividers
 * - Responsive breakpoints
 */
export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allDocsIndex, setAllDocsIndex] = useState<{ slug: string; title: string; content: string }[]>([]);
  const [searchResults, setSearchResults] = useState<{ slug: string; title: string; snippet: string }[]>([]);
  const [activeSection, setActiveSection] = useState("getting-started");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // Chatbot state management
  const [chatState, setChatState] = useState<"collapsed" | "focused" | "expanded">("collapsed");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentSection = docsSections.find(s => s.id === activeSection);

  // Fetch markdown content when section changes
  useEffect(() => {
    const fetchContent = async () => {
      if (!currentSection) return;
      
      setIsLoadingContent(true);
      try {
        const response = await fetch(`/api/docs/${currentSection.slug}`);
        if (response.ok) {
          const data = await response.json();
          setMarkdownContent(data.content);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to fetch documentation:', errorData);
          setMarkdownContent(`# Error\n\nFailed to load documentation content.\n\n**Status:** ${response.status}\n\n**Details:** ${errorData.error || 'Unknown error'}\n\n**Path:** ${errorData.path || 'Unknown'}`);
        }
      } catch (error) {
        console.error('Error fetching documentation:', error);
        setMarkdownContent(`# Error\n\nFailed to load documentation content.\n\n**Error:** ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchContent();
  }, [activeSection, currentSection]);

  // Filter sections based on search (searches in title and description)
  const filteredSections = docsSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync active section from URL hash (supports direct links to specific docs)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash?.replace('#', '')
      if (hash && docsSections.find(s => s.id === hash || s.slug === hash)) {
        setActiveSection(hash)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  // Build a simple full-text index of all docs (fetch once)
  useEffect(() => {
    const buildIndex = async () => {
      try {
        const entries: { slug: string; title: string; content: string }[] = [];
        for (const s of docsSections) {
          const res = await fetch(`/api/docs/${s.slug}`);
          if (res.ok) {
            const data = await res.json();
            entries.push({ slug: s.slug, title: s.title, content: String(data.content || "") });
          }
        }
        setAllDocsIndex(entries);
      } catch (e) {
        console.error('Failed to index docs', e);
      }
    };
    buildIndex();
  }, []);

  // Full-text search with snippets beneath the search input
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }
    const results: { slug: string; title: string; snippet: string }[] = [];
    for (const entry of allDocsIndex) {
      const hay = entry.content.toLowerCase();
      const idx = hay.indexOf(q);
      if (idx >= 0) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(entry.content.length, idx + q.length + 60);
        let snippet = entry.content.slice(start, end).replace(/\n/g, ' ');
        snippet = snippet.replace(new RegExp(q, 'ig'), m => `«${m}»`);
        results.push({ slug: entry.slug, title: docsSections.find(d => d.slug === entry.slug)?.title || entry.slug, snippet });
      }
    }
    setSearchResults(results.slice(0, 8));
  }, [searchQuery, allDocsIndex]);

  // Handle section navigation - smooth scroll and close mobile menu
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (typeof window !== 'undefined') {
      const newHash = `#${sectionId}`
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash)
      }
    }
    setSidebarOpen(false); // Close mobile menu after selection
  };

  // Auto-scroll to bottom of chat when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /**
   * Handle chat input submission
   * - Adds user message to chat
   * - Shows thinking animation
   * - Calls Gemini AI API for documentation-based response
   */
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput.trim();
    setChatInput("");
    setIsThinking(true);
    setChatState("expanded"); // Expand to show response

    try {
      // Call Gemini AI API with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your question. Please try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  /**
   * Regenerate last assistant response using AI
   */
  const handleRegenerate = async () => {
    if (chatMessages.length === 0) return;
    
    // Find the last user message to regenerate response for
    const lastUserMessageIndex = chatMessages.map(m => m.role).lastIndexOf('user');
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = chatMessages[lastUserMessageIndex];
    
    // Remove messages after the last user message
    setChatMessages(prev => prev.slice(0, lastUserMessageIndex + 1));
    setIsThinking(true);

    try {
      // Get conversation history up to the last user message
      const historyBeforeLastMessage = chatMessages.slice(0, lastUserMessageIndex);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: lastUserMessage.content,
          conversationHistory: historyBeforeLastMessage.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate response');
      }

      const data = await response.json();
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Regenerate error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error regenerating the response. Please try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  /**
   * Copy message content to clipboard with visual feedback
   */
  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    
    // Hide "Copied!" after 2 seconds
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  /**
   * Toggle like on a message
   */
  const handleLike = (messageId: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove dislike if present
        setDislikedMessages(prevDisliked => {
          const newDisliked = new Set(prevDisliked);
          newDisliked.delete(messageId);
          return newDisliked;
        });
      }
      return newSet;
    });
  };

  /**
   * Toggle dislike on a message
   */
  const handleDislike = (messageId: string) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove like if present
        setLikedMessages(prevLiked => {
          const newLiked = new Set(prevLiked);
          newLiked.delete(messageId);
          return newLiked;
        });
      }
      return newSet;
    });
  };

  /**
   * Clear all chat messages
   */
  const handleClearChat = () => {
    setChatMessages([]);
    setChatState("collapsed");
  };

  /**
   * Collapse chat to pill input
   */
  const handleCollapse = () => {
    setChatState("collapsed");
  };

  return (
    // OLD: <main className="min-h-screen bg-black">
    <main className="min-h-screen bg-black">
      {/* Mobile Sidebar Toggle Button - Shows only on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center justify-center shadow-lg transition-all"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* 
        FIXED LEFT SIDEBAR NAVIGATION
        - Desktop: Always visible, fixed position, scrollable
        - Mobile: Slide-in overlay, closes after selection
      */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[250px] bg-black border-r border-white/10 z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-24 overflow-y-auto
        `}
      >
        <div className="px-4 py-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-4">
            Documentation
          </h3>
          
          {/* Sidebar Navigation Items */}
          <nav className="space-y-1">
            {(searchQuery ? filteredSections : docsSections).map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    transition-all duration-200 text-left group
                    ${activeSection === section.id
                      ? 'bg-purple-500/20 border border-purple-400/50 text-purple-400 shadow-lg shadow-purple-500/10'
                      : 'bg-transparent border border-transparent text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    activeSection === section.id ? 'text-purple-400' : 'text-white/40 group-hover:text-white/60'
                  }`} />
                  <span className="text-sm font-medium flex-1">{section.title}</span>
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
          </aside>

      {/* Mobile Sidebar Overlay - Darkens background when sidebar is open */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 
        MAIN CONTENT AREA
        - Offset by sidebar width on desktop (ml-[250px])
        - Adjusts right margin when chat is expanded (mr-[320px])
        - Full width on mobile
      */}
      {/* OLD: <div className="max-w-7xl mx-auto px-4 py-8"> */}
      <div className={`lg:ml-[250px] min-h-screen transition-all duration-300 ${
        chatState === "expanded" ? "lg:mr-[320px]" : ""
      }`}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-white/60 text-lg">
              Everything you need to know about trading on ShadowSwap
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl">
              <Search
                aria-hidden="true"
                className="absolute left-4 inset-y-0 my-auto w-5 h-5 text-white/80 pointer-events-none"
                strokeWidth={2}
                shapeRendering="geometricPrecision"
                vectorEffect="non-scaling-stroke"
              />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20"
              />
              {searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-20">
                  {searchResults.length > 0 ? (
                    <ul className="max-h-72 overflow-y-auto py-2">
                      {searchResults.map((r, i) => (
                        <li key={`${r.slug}-${i}`}>
                          <button
                            onClick={() => {
                              setActiveSection(r.slug);
                              const hash = `#${r.slug}`
                              if (window.location.hash !== hash) {
                                history.replaceState(null, '', hash)
                              }
                              setSearchQuery("");
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                          >
                            <div className="text-sm font-semibold text-white">{r.title}</div>
                            <div className="text-xs text-white/60 mt-0.5 line-clamp-2">{r.snippet}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-white/50">No matches found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Card with Enhanced Visual Hierarchy */}
          <Card className="glass border-white/10 shadow-2xl">
            <CardContent className="p-8 md:p-12">
                {currentSection && (
                  <>
                  {/* Section Header with Icon */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent">
                      {(() => {
                        const Icon = currentSection.icon;
                      return (
                        <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-purple-400" />
                        </div>
                      );
                      })()}
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{currentSection.title}</h2>
                      <p className="text-white/50 text-sm mt-2">{currentSection.description}</p>
                    </div>
                    </div>
                    
                  {/* Markdown Content Rendering */}
                  {isLoadingContent ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  ) : (
                    <MarkdownRenderer content={markdownContent} />
                  )}
                  </>
                )}

                {filteredSections.length === 0 && !currentSection && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-lg">No results found for "{searchQuery}"</p>
                  <p className="text-white/30 text-sm mt-2">Try searching with different keywords</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      {/* 
        OLD CHATBOT (Commented out for reference):
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-500..."
        >
          <MessageCircle />
        </button>
      */}

      {/* 
        NEW AI CHATBOT - Three States:
        1. COLLAPSED: Bottom-center pill input
        2. FOCUSED: Expanded input with hint
        3. EXPANDED: Full right-side chat panel
      */}
      
      {/* STATE 1 & 2: COLLAPSED/FOCUSED - Bottom-center pill input with accent lines */}
      {chatState !== "expanded" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[380px] px-4">
          <form onSubmit={handleChatSubmit} className="relative">
            <div
              className={`
                accent-line accent-line-purple
                bg-black/90 backdrop-blur-md border border-purple-400/30
                rounded-full
                transition-all duration-300 ease-out
                p-2.5
                ${chatState === "focused" 
                  ? "border-purple-400/50" 
                  : "hover:-translate-y-1 hover:border-purple-400/60 hover:scale-[1.02]"
                }
                group
              `}
            >
              <div className="flex items-center gap-2.5">
                {/* AI Icon - with hover animation */}
                <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300">
                  <Sparkles className="w-4 h-4 text-purple-400/80 group-hover:text-purple-400 group-hover:rotate-12 transition-all duration-300" />
                </div>

                {/* Input Field */}
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onFocus={() => setChatState("focused")}
                  onBlur={() => chatState === "focused" && setChatState("collapsed")}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-sm"
                />

                {/* Keyboard hint - shows when focused */}
                {chatState === "focused" && (
                  <span className="hidden sm:block text-xs text-white/30 font-mono px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                    ⌘I
                  </span>
                )}

                {/* Send Button - with hover animation */}
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-7 h-7 rounded-full bg-purple-500 hover:bg-purple-600 hover:scale-110 hover:rotate-12 disabled:bg-purple-500/20 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 flex-shrink-0 disabled:hover:scale-100 disabled:hover:rotate-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* STATE 3: EXPANDED - Full right-side chat panel */}
      {chatState === "expanded" && (
        <>
          {/* Backdrop overlay for mobile */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleCollapse}
          />

          {/* Chat Panel - Narrower width (320px instead of 450px) */}
          <div
            className="fixed right-0 top-0 h-screen w-full lg:w-[320px] bg-black/98 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-gradient-to-b from-purple-500/10 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Delete chat button */}
                {chatMessages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-red-400 transition-all"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Minimize button */}
              <button
                  onClick={handleCollapse}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  aria-label="Minimize chat"
              >
                  <Minimize2 className="w-4 h-4" />
              </button>

                {/* Close button */}
                <button
                  onClick={() => {
                    setChatState("collapsed");
                    setChatMessages([]);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && !isThinking && (
                <div className="text-center py-12 text-white/40">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400/30" />
                  <p className="text-sm">Ask me anything about ShadowSwap!</p>
                  <p className="text-xs mt-2">I'll help you understand our docs.</p>
                </div>
              )}

              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* User Message */}
                  {message.role === "user" && (
                    <div className="max-w-[90%] bg-purple-500/20 border border-purple-400/30 rounded-2xl rounded-tr-sm px-3 py-2.5">
                      <p className="text-white text-sm">{message.content}</p>
                    </div>
                  )}

                  {/* Assistant Message with Actions */}
                  {message.role === "assistant" && (
                    <div className="max-w-[90%] space-y-2">
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2.5">
                        <p className="text-white/80 text-sm leading-relaxed">{message.content}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 px-2 relative">
                        {/* Copy Button with "Copied!" popup */}
                        <div className="relative">
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                            aria-label="Copy message"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {/* "Copied!" popup - subtle white */}
                          {copiedMessageId === message.id && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-lg">
                              Copied!
                            </div>
                          )}
                        </div>

                        {/* Regenerate Button */}
                        <button
                          onClick={handleRegenerate}
                          className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                          aria-label="Regenerate response"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Like Button - fills with green when active */}
                        <button
                          onClick={() => handleLike(message.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            likedMessages.has(message.id)
                              ? 'bg-green-500/20 text-green-400'
                              : 'hover:bg-white/5 text-white/40 hover:text-green-400'
                          }`}
                          aria-label="Like response"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${likedMessages.has(message.id) ? 'fill-green-400' : ''}`} />
                        </button>

                        {/* Dislike Button - fills with red when active */}
                        <button
                          onClick={() => handleDislike(message.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            dislikedMessages.has(message.id)
                              ? 'bg-red-500/20 text-red-400'
                              : 'hover:bg-white/5 text-white/40 hover:text-red-400'
                          }`}
                          aria-label="Dislike response"
                        >
                          <ThumbsDown className={`w-3.5 h-3.5 ${dislikedMessages.has(message.id) ? 'fill-red-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking animation */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Area at Bottom */}
            <div className="p-3 border-t border-white/10">
              <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a follow-up..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-white placeholder:text-white/40 text-sm outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-9 h-9 rounded-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>
          </div>
        </>
        )}
    </main>
  );
}

/**
 * HOW TO REVERT TO OLD LAYOUT:
 * 
 * 1. Remove fixed sidebar and mobile toggle button
 * 2. Restore old grid layout (see // OLD: comments)
 * 3. Simplify content rendering (remove enhanced visual hierarchy)
 * 4. Remove handleSectionClick and sidebarOpen state
 * 
 * Key sections to revert:
 * - Sidebar: Remove fixed positioning, restore simple grid column
 * - Content: Remove ml-[250px] offset, restore max-w-7xl wrapper
 * - Typography: Revert heading sizes and spacing
 * - Lists: Remove enhanced card backgrounds and custom bullets
 */