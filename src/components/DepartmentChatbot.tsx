import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Plane,
  Sun,
  Database,
  ExternalLink,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  roleId?: string;
}

interface DepartmentChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: {
    year: string;
    mode: string;
    continent: string;
    state: string;
    timelineEra?: string;
  };
}

const DEPARTMENT_ROLES = [
  {
    id: 'strategic_director',
    name: 'Strategic Direction & Policy',
    desc: 'Embratur Board & MTur policy, bilateral treaties, macro economic yield',
    icon: Layers,
    color: 'emerald',
    badge: 'Macro Policy'
  },
  {
    id: 'aviation_gateways',
    name: 'Aviation & Gateways',
    desc: 'Route connectivity, airport slots (GRU/GIG/SSA), border crossings',
    icon: Plane,
    color: 'cyan',
    badge: 'Logistics'
  },
  {
    id: 'seasonality_campaigns',
    name: 'Seasonality & Campaigns',
    desc: 'Counter-seasonality marketing (May/Jun trough), Carnival, Visit Brasil',
    icon: Sun,
    color: 'amber',
    badge: 'Promotion'
  },
  {
    id: 'data_auditor',
    name: 'Data Science & STI Auditor',
    desc: 'Time-series statistics, Polícia Federal registry, variance analysis',
    icon: Database,
    color: 'purple',
    badge: 'STI Intelligence'
  }
];

const MODEL_OPTIONS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    badge: 'General Tasks (Recommended)',
    icon: Sparkles,
    desc: 'Balanced speed and analytical intelligence for department queries'
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    badge: 'Fast Q&A',
    icon: Zap,
    desc: 'Ultra low-latency responses for quick metric lookups and checks'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview',
    badge: 'Complex Reasoning',
    icon: Brain,
    desc: 'Deep multi-step reasoning, econometric forecasting, strategic plans'
  }
];

const SUGGESTED_QUESTIONS = [
  'Why does Argentina capture 31% of all inbound arrivals, and how can Brazil diversify?',
  'What strategic campaigns should Embratur deploy to address the May-June low trough?',
  'Compare post-COVID aviation recovery against terrestrial cross-border arrivals.',
  'How did the 2019 visa waiver affect North American tourist numbers?',
  'Which secondary gateways outside SP and RJ show the strongest expansion potential?'
];

export const DepartmentChatbot: React.FC<DepartmentChatbotProps> = ({
  isOpen,
  onClose,
  activeFilters
}) => {
  const [selectedRole, setSelectedRole] = useState('strategic_director');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `**Bem-vindo ao Núcleo de Inteligência Turística | Embratur & MTur**

Sou o assistente analítico oficial do **Ministério do Turismo e da Embratur**, parametrizado com a série histórica completa de 10 anos (2015–2024, 120 meses) do *TurDataDeBrazil.xlsx*.

Estou conectado aos seus **filtros ativos de painel**:
- **Horizonte**: ${activeFilters.year || 'Todos os Anos'}
- **Modalidade**: ${activeFilters.mode || 'Todos os Modos'}
- **Continente**: ${activeFilters.continent || 'Global'}
- **Porta de Entrada (UF)**: ${activeFilters.state || 'Todas as 27 UFs'}

Como posso assessorar sua pasta técnica ou diretoria hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      roleId: 'strategic_director'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for multi-turn conversation
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload,
          model: selectedModel,
          roleId: selectedRole,
          activeFilters: activeFilters
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Server error occurred');
      }

      const botReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        roleId: data.roleId || selectedRole
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Erro na Consulta**: ${err.message || 'Não foi possível se comunicar com o modelo Gemini.'}\n\n*Por favor, verifique se a chave GEMINI_API_KEY está configurada no painel de Secrets ou tente outro modelo.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        roleId: selectedRole
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Sessão reiniciada. O histórico anterior foi limpo.\n\nFiltros ativos mantidos (${activeFilters.year}, ${activeFilters.mode}). Pronto para nova análise departmental.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        roleId: selectedRole
      }
    ]);
  };

  if (!isOpen) return null;

  const currentRole = DEPARTMENT_ROLES.find((r) => r.id === selectedRole) || DEPARTMENT_ROLES[0];
  const currentModel = MODEL_OPTIONS.find((m) => m.id === selectedModel) || MODEL_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md transition-all duration-200">
      <div className="relative flex flex-col w-full max-w-4xl h-[90vh] bg-[#0E172E] border border-[#1E2D56] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* TOP BAR / HEADER */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1E2D56] bg-[#0B132B]/90 gap-3">
          
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-amber-500 p-[2px] shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Embratur AI Core
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Grounded Intelligence
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Department Intelligence Chatbot
              </h2>
            </div>
          </div>

          {/* Quick Selectors & Close */}
          <div className="flex items-center gap-2">
            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-2 rounded-lg bg-[#131D38] border border-[#1E2D56] text-slate-400 hover:text-white hover:bg-[#1E2D56] transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#131D38] border border-[#1E2D56] text-slate-400 hover:text-white hover:bg-[#1E2D56] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS SUB-BAR: ROLE SELECTOR & MODEL SELECTOR */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#101B38] border-b border-[#1E2D56]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowModelDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B132B] border border-[#1E2D56] hover:border-emerald-500/40 text-slate-200 transition"
              >
                <currentRole.icon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">Role: {currentRole.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              {showRoleDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#0B132B] border border-[#1E2D56] rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Advisory Role
                  </div>
                  {DEPARTMENT_ROLES.map((r) => {
                    const Icon = r.icon;
                    const isActive = r.id === selectedRole;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedRole(r.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                            : 'hover:bg-[#131D38] text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-xs text-white">{r.name}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Model Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowModelDropdown(!showModelDropdown);
                  setShowRoleDropdown(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B132B] border border-[#1E2D56] hover:border-sky-500/40 text-slate-200 transition"
              >
                <currentModel.icon className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">{currentModel.name}</span>
                <span className="text-[10px] text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded border border-sky-400/20 hidden sm:inline">
                  {currentModel.badge}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
              </button>

              {showModelDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-80 bg-[#0B132B] border border-[#1E2D56] rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Gemini Architecture
                  </div>
                  {MODEL_OPTIONS.map((m) => {
                    const Icon = m.icon;
                    const isActive = m.id === selectedModel;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                            : 'hover:bg-[#131D38] text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{m.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">
                              {m.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{m.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Active Context Chip */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard Sync: <strong>{activeFilters.year}</strong> &bull; <strong>{activeFilters.mode}</strong></span>
          </div>
        </div>

        {/* CHAT MESSAGES SCROLLABLE THREAD */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scroll">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-[#1E2D56] text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Box */}
                <div
                  className={`flex flex-col space-y-1 ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                    <span className="font-semibold">
                      {isUser ? 'Department Officer' : 'Embratur Intelligence Core'}
                    </span>
                    <span>&bull;</span>
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && !isUser && (
                      <>
                        <span>&bull;</span>
                        <span className="text-sky-400 font-mono text-[9px] bg-sky-400/10 px-1 rounded">
                          {msg.modelUsed}
                        </span>
                      </>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed relative group ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-tr-none shadow-md'
                        : 'bg-[#131D38] border border-[#1E2D56] text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    {/* Render Formatted Markdown / Plain text */}
                    <div className="whitespace-pre-wrap break-words space-y-2">
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is a list
                        if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                          const items = paragraph.split('\n').filter(Boolean);
                          return (
                            <ul key={pIdx} className="space-y-1 my-1.5 pl-3 list-disc marker:text-emerald-400">
                              {items.map((item, iIdx) => (
                                <li key={iIdx}>
                                  <FormattedSpan text={item.replace(/^[-*]\s*/, '')} />
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={pIdx}>
                            <FormattedSpan text={paragraph} />
                          </p>
                        );
                      })}
                    </div>

                    {/* Copy action for model messages */}
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        title="Copy analysis"
                        className="absolute bottom-2 right-2 p-1 rounded bg-[#0B132B]/80 hover:bg-[#0B132B] text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[88%]">
              <div className="w-8 h-8 rounded-lg shrink-0 bg-[#1E2D56] text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#131D38] border border-[#1E2D56] rounded-2xl rounded-tl-none p-3.5 shadow-lg flex items-center gap-2.5 text-xs text-slate-300">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>Analyzing 10-year STI dataset with {currentModel.name}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK QUESTIONS DRAWER */}
        <div className="px-4 sm:px-6 py-2 bg-[#0B132B]/70 border-t border-[#1E2D56]/60 flex items-center gap-2 overflow-x-auto custom-scroll">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested Prompts:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#131D38] border border-[#1E2D56] text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-[#1E2D56] transition shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* INPUT FORM */}
        <div className="p-3 sm:p-4 bg-[#0B132B] border-t border-[#1E2D56]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2.5"
          >
            <div className="relative flex-1 bg-[#131D38] border border-[#1E2D56] rounded-xl focus-within:border-emerald-500 transition shadow-inner">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Mercosul trends, gateway volume, modal splits, seasonality..."
                rows={2}
                disabled={isLoading}
                className="w-full bg-transparent text-white text-xs px-3.5 py-2.5 placeholder-slate-400 focus:outline-none resize-none custom-scroll disabled:opacity-60"
              />
              <div className="flex items-center justify-between px-3 pb-2 text-[10px] text-slate-400">
                <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline</span>
                <span>Active: {currentRole.badge}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="h-14 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

// Helper for formatted markdown text (bold, code, headers)
const FormattedSpan: React.FC<{ text: string }> = ({ text }) => {
  // Simple parser for bold **text** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="bg-[#0B132B] px-1.5 py-0.5 rounded font-mono text-[11px] text-sky-400 border border-[#1E2D56]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
};
export default DepartmentChatbot;
