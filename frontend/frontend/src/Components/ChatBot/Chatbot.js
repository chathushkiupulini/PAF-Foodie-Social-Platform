import React, { useState } from 'react';
import './ChatBot.css';
import { MessageCircle, Send, X } from 'lucide-react';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { text: input, isBot: false }]);
        
        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "Thank you for your message. Our team will get back to you soon.",
                isBot: true
            }]);
        }, 1000);

        setInput('');
    };

    return (
        <div className="chatbot">
            {!isOpen ? (
                <button 
                    className="chatbot-toggle"
                    onClick={() => setIsOpen(true)}
                    title="Open chat"
                >
                    <MessageCircle size={24} />
                </button>
            ) : (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>Chat Support</h3>
                        <button 
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.isBot ? 'bot' : 'user'}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chatbot;