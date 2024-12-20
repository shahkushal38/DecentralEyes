// import React, { useState, useRef, useEffect } from 'react';
// import { Send, User, Bot, RefreshCw } from 'lucide-react';
// import { getAllTools } from '../abi/index';

// const ContainedChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Welcome! I'm your AI assistant. How can I help you today?",
//       sender: 'bot',
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const messagesEndRef = useRef(null);

//   const fetchCampaigns = async () => {
//     const allTools = await getAllTools();
//     console.log('all tools are:', allTools);
//   };

//   useEffect(() => {
//     console.log('rendered use effect');
//     fetchCampaigns();
//   }, []);

//   // Scroll to bottom when messages update
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (inputMessage.trim() === '') return;

//     // Add user message
//     const userMessage = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: 'user',
//     };

//     // Add bot response (simulated)
//     const botResponse = {
//       id: messages.length + 2,
//       text: `You said: ${inputMessage}. How can I help you further?`,
//       sender: 'bot',
//     };

//     setMessages([...messages, userMessage, botResponse]);
//     setInputMessage('');
//   };

//   const regenerateResponse = () => {
//     // Simulate regenerating the last bot response
//     const lastBotMessageIndex = messages.findLastIndex(
//       (m) => m.sender === 'bot'
//     );
//     if (lastBotMessageIndex !== -1) {
//       const updatedMessages = [...messages];
//       updatedMessages[lastBotMessageIndex] = {
//         ...updatedMessages[lastBotMessageIndex],
//         text: 'Regenerated response: Let me provide an alternative perspective.',
//       };
//       setMessages(updatedMessages);
//     }
//   };

//   return (
//     <div className="w-full mx-auto bg-[#1c1c24] rounded-xl shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className=" bg-[#1c1c24] p-4 text-center border-b border-gray-900">
//         <h1 className="text-gray-200 text-2xl font-bold tracking-wider">
//           AI Assistant
//         </h1>
//         <p className="text-gray-500 text-sm mt-1">
//           Intelligent. Responsive. Precise.
//         </p>
//       </div>

//       {/* Message Container */}
//       <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-[#1c1c24]">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex items-start space-x-3 ${
//               message.sender === 'user' ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             {message.sender === 'bot' && (
//               <div className="bg-gray-900 p-2 rounded-full">
//                 <Bot className="text-gray-300" size={20} />
//               </div>
//             )}

//             <div
//               className={`
//                 max-w-[80%] p-3 rounded-2xl
//                 ${
//                   message.sender === 'user'
//                     ? 'bg-gray-800 text-gray-100'
//                     : 'bg-gray-900 text-gray-300'
//                 }
//                 shadow-lg
//                 transition-all duration-300 ease-in-out
//                 transform hover:scale-[1.02]
//               `}
//             >
//               {message.text}
//             </div>

//             {message.sender === 'user' && (
//               <div className="bg-gray-800 p-2 rounded-full">
//                 <User className="text-gray-300" size={20} />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4  bg-[#1c1c24] border-t border-gray-900 flex items-center space-x-2">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//           placeholder="Type your message..."
//           className="
//             flex-grow
//             bg-black
//             text-gray-300
//             p-3
//             rounded-xl
//             border
//             border-gray-800
//             focus:outline-none
//             focus:ring-2
//             focus:ring-gray-700
//             placeholder-gray-600
//           "
//         />
//         <button
//           onClick={handleSendMessage}
//           className="
//             bg-gray-800
//             hover:bg-gray-700
//             text-gray-200
//             p-3
//             rounded-full
//             transition-colors
//             duration-200
//             flex
//             items-center
//             justify-center
//           "
//         >
//           <Send size={20} />
//         </button>
//         <button
//           onClick={regenerateResponse}
//           className="
//             bg-gray-900
//             hover:bg-gray-800
//             text-gray-400
//             p-3
//             rounded-full
//             transition-colors
//             duration-200
//             flex
//             items-center
//             justify-center
//           "
//         >
//           <RefreshCw size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContainedChatbot;

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, RefreshCw } from 'lucide-react';
import { getAllTools, submitReview } from '../abi/index';
import { getWalletAddress } from '../context/CoinBaseWallet';
import { createAttestion } from '../eas/easCreate';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const ContainedChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Welcome! I'm your AI assistant. Please choose an option:
           <ul>
             <li>1) Add review for a tool</li>
             <li>2) Ask any query related to the tools</li>
           </ul>`,
      sender: 'bot',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('initial'); // Track user flow
  const messagesEndRef = useRef(null);

  const fetchCampaigns = async () => {
    const allTools = await getAllTools();
    console.log('All tools are:', allTools);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Handle different chatbot flows based on the current step
    if (currentStep === 'initial') {
      if (inputMessage === '1') {
        setCurrentStep('addReview');
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 2,
            text: 'Please add your review for the product along with a rating and your GitHub URL.',
            sender: 'bot',
          },
        ]);
      } else if (inputMessage === '2') {
        setCurrentStep('askQuery');
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 2,
            text: 'You can now ask any query related to the tools. Go ahead!',
            sender: 'bot',
          },
        ]);
      }
    } else if (currentStep === 'addReview') {
      console.log('Hello!!!');
      // Simulate API call to processReviews
      try {
        const response = await axios.post(
          'http://localhost:3000/processReview',
          { text: inputMessage }
        );
        console.log('response.data newww: ', response.data);

        const data = {
          address: getWalletAddress,
          toolName: response.data.reviewBreakdown.ToolName,
          text: response.data.reviewBreakdown.ReviewDescription,
          githubURL: response.data.reviewBreakdown.GithubUrl,
          rating: response.data.reviewBreakdown.Rating,
        };

        const res = await createAttestion(data);
        let attestId = '';
        if (res && res.verified === true) {
          attestId = res.data;
        }

        // toolId, score, comment, projectLink, reviewKeywords, nullifierId, isAttested, attestationId
        const fetchedTools = await getAllTools();
        console.log("🚀 ~ handleSendMessage ~ fetchedTools:", fetchedTools)
        console.log("item.name ", data.toolName )
        const found = fetchedTools.find((item) => item.name == data.toolName);
        console.log("🚀 ~ handleSendMessage ~ found:", found)
        data.id = found.id;

        const submitRev = await submitReview(
          data.id,
          data.rating,
          data.text,
          data.githubURL,
          response.data.tags,
          uuidv4(),
          res.verified,
          attestId
        );

        //contract

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 2,
            text: 'Thank you for your review! It has been submitted successfully.',
            sender: 'bot',
          },
        ]);
        console.log('Review processed successfully:', response);
        setCurrentStep('initial'); // Reset flow
      } catch (error) {
        console.error('Error processing review:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 2,
            text: 'There was an error submitting your review. Please try again.',
            sender: 'bot',
          },
        ]);
      }
    } else if (currentStep === 'askQuery') {
      // Handle tool-related query (simulated response)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 2,
          text: `You asked: "${inputMessage}". Let me find the information for you.`,
          sender: 'bot',
        },
      ]);
    }
  };

  const regenerateResponse = () => {
    const lastBotMessageIndex = messages.findLastIndex(
      (m) => m.sender === 'bot'
    );
    if (lastBotMessageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[lastBotMessageIndex] = {
        ...updatedMessages[lastBotMessageIndex],
        text: 'Regenerated response: Let me provide an alternative perspective.',
      };
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="w-full mx-auto bg-[#1c1c24] rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#1c1c24] p-4 text-center border-b border-gray-900">
        <h1 className="text-gray-200 text-2xl font-bold tracking-wider">
          AI Assistant
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Intelligent. Responsive. Precise.
        </p>
      </div>

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
              dangerouslySetInnerHTML={{ __html: message.text }}
              className={`
                max-w-[80%] p-3 rounded-2xl
                ${message.sender === 'user' ? 'bg-gray-800 text-gray-100' : 'bg-gray-900 text-gray-300'}
                shadow-lg
                transition-all duration-300 ease-in-out
                transform hover:scale-[1.02]
              `}
            >
              {/* {message.text} */}
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

      <div className="p-4 bg-[#1c1c24] border-t border-gray-900 flex items-center space-x-2">
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
  );
};

export default ContainedChatbot;
