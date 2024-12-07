import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, RefreshCw } from 'lucide-react'
import { getAllTools } from "../abi/index"

const ContainedChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Welcome! I'm your AI assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);


  const fetchCampaigns = async () => {
    const allTools = await getAllTools()
    console.log("all tools are:", allTools);
  }

  useEffect(() => {
    console.log("rendered use effect");
    fetchCampaigns();
  }, []);


  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    // Add bot response (simulated)
    const botResponse = {
      id: messages.length + 2,
      text: `You said: ${inputMessage}. How can I help you further?`,
      sender: 'bot'
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputMessage('');
  };

  const regenerateResponse = () => {
    // Simulate regenerating the last bot response
    const lastBotMessageIndex = messages.findLastIndex(m => m.sender === 'bot');
    if (lastBotMessageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[lastBotMessageIndex] = {
        ...updatedMessages[lastBotMessageIndex],
        text: "Regenerated response: Let me provide an alternative perspective."
      };
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="w-full mx-auto bg-[#1c1c24] rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className=" bg-[#1c1c24] p-4 text-center border-b border-gray-900">
        <h1 className="text-gray-200 text-2xl font-bold tracking-wider">
          AI Assistant
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Intelligent. Responsive. Precise.
        </p>
      </div>

      {/* Message Container */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-[#1c1c24]">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="bg-gray-900 p-2 rounded-full">
                <Bot className="text-gray-300" size={20} />
              </div>
            )}
            
            <div 
              className={`
                max-w-[80%] p-3 rounded-2xl 
                ${message.sender === 'user' 
                  ? 'bg-gray-800 text-gray-100' 
                  : 'bg-gray-900 text-gray-300'}
                shadow-lg
                transition-all duration-300 ease-in-out
                transform hover:scale-[1.02]
              `}
            >
              {message.text}
            </div>

            {message.sender === 'user' && (
              <div className="bg-gray-800 p-2 rounded-full">
                <User className="text-gray-300" size={20} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4  bg-[#1c1c24] border-t border-gray-900 flex items-center space-x-2">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="
            flex-grow 
            bg-black 
            text-gray-300 
            p-3 
            rounded-xl 
            border 
            border-gray-800
            focus:outline-none 
            focus:ring-2 
            focus:ring-gray-700
            placeholder-gray-600
          "
        />
        <button 
          onClick={handleSendMessage}
          className="
            bg-gray-800 
            hover:bg-gray-700 
            text-gray-200 
            p-3 
            rounded-full 
            transition-colors 
            duration-200
            flex 
            items-center 
            justify-center
          "
        >
          <Send size={20} />
        </button>
        <button 
          onClick={regenerateResponse}
          className="
            bg-gray-900 
            hover:bg-gray-800 
            text-gray-400 
            p-3 
            rounded-full 
            transition-colors 
            duration-200
            flex 
            items-center 
            justify-center
          "
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  )
}

export default ContainedChatbot