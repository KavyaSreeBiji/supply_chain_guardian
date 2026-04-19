import { useState, useRef, useEffect } from 'react';

const badgeMap = {
    'orchestrator': { color: 'orchestrator', name: '🤖 Orchestrator' },
    'inventory': { color: 'inventory', name: '📦 Inventory Agent' },
    'strategy': { color: 'strategy', name: '🌤️ Strategy Agent' },
    'market': { color: 'market', name: '📈 Market Agent' },
};

function ChatBox() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "👋 Supply Chain Guardian online. I have three specialized agents monitoring your inventory, shipments, and market intelligence. Ask me anything or use the quick actions below.", agent: 'orchestrator' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (messageText) => {
        const msg = messageText || input.trim();
        if(!msg) return;

        setInput('');
        setLoading(true);

        const newMessages = [...messages, { role: 'user', content: msg }];
        setMessages(newMessages);

        // Filter out initial greeting and format history for API
        const historyForApi = newMessages.slice(1).map(m => ({
            role: m.role,
            content: m.content
        }));

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history: historyForApi.slice(0, -1) }) 
            });
            const data = await res.json();
            
            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `Connection Error: ${data.error}`, agent: 'orchestrator' }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply, agent: data.agent }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Network Error communicating with server.", agent: 'orchestrator' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <section id="chat">
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((m, idx) => (
                        <div key={idx} className={`message ${m.role}`}>
                            {m.role === 'assistant' && badgeMap[m.agent] && (
                                <div className={`agent-badge ${badgeMap[m.agent].color}`}>
                                    <span>{badgeMap[m.agent].name}</span>
                                </div>
                            )}
                            <div className="message-bubble">{m.content}</div>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-loading">
                            <div className="agent-badge">
                                <span>🤖 Thinking...</span>
                            </div>
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="chat-suggestions">
                    <button className="quick-prompt" onClick={() => handleSend("What items need immediate reorder?")}>What items need immediate reorder?</button>
                    <button className="quick-prompt" onClick={() => handleSend("Which shipments are at risk of delay?")}>Which shipments are at risk of delay?</button>
                    <button className="quick-prompt" onClick={() => handleSend("Are there any buying opportunities right now?")}>Are there any buying opportunities right now?</button>
                    <button className="quick-prompt" onClick={() => handleSend("Give me a full supply chain health report")}>Give me a full supply chain health report</button>
                </div>
                
                <div className="chat-input-area">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about inventory, shipments, market trends..." 
                        disabled={loading}
                    />
                    <button onClick={() => handleSend()} disabled={loading}>
                        {loading ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ChatBox;
