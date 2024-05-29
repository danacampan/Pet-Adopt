import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'incoming', text: 'Bună👋\nCum te pot ajuta?' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'outgoing', text: newMessage },
      ]);

      setIsLoading(true);

      const response = await axios.post('/api/chatbot/questions/compare', {
        text: newMessage,
      });

      const similarQuestions = response.data;
      if (similarQuestions.length > 0) {
        const questionId = similarQuestions[0]._id;
        const answerResponse = await axios.get(
          `/api/chatbot/questions/${questionId}/answers`
        );
        const answers = answerResponse.data;

        setMessages((prevMessages) => [
          ...prevMessages,
          ...answers.map((answer) => ({ type: 'incoming', text: answer.text })),
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'incoming',
            text: 'Îmi pare rău, nu am găsit răspunsul la întrebarea ta.',
          },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }

    setNewMessage('');
  };

  return (
    <>
      <button className="chatbot-toggler" onClick={handleToggle}>
        <div className="material-symbols-rounded">
          <i className="fas fa-comment"></i>
        </div>
        <span className="material-symbols-outlined">close</span>
      </button>
      {isOpen && (
        <div className="chatbot">
          <header>
            <h2>Chat</h2>
            <span
              className="close-btn material-symbols-outlined"
              onClick={handleToggle}
            >
              <i className="fas fa-minus"></i>
            </span>
          </header>
          <ul className="chatbox">
            {messages.map((message, index) => (
              <li key={index} className={`chat ${message.type}`}>
                {message.type === 'incoming' && (
                  <span className="material-symbols-outlined"></span>
                )}
                <p>
                  {message.type === 'outgoing'} {message.text}
                </p>
              </li>
            ))}
          </ul>
          <div className="chat-input mb-3">
            <textarea
              placeholder="Pune o întrebare..."
              spellCheck="false"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <span
              id="send-btn"
              className="material-symbols-rounded"
              onClick={handleSendMessage}
            >
              Send
            </span>
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
