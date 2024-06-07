import React, { useState } from 'react';
import axios from 'axios';
import styles from './chatgpt.module.css';
import ChatGptLogo from './poze/ChatGptlogo.png';

const ChatGpt = () => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await makeRequestWithRetry(newMessages);
        setMessages([...newMessages, { role: 'assistant', content: response.data.choices[0].message.content }]);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsLoading(false);
      }

      setInput('');
    }
  };

  const makeRequestWithRetry = async (newMessages, retries = 3, delay = 1000) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...newMessages,
            { role: "user", content: input }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-proj-x7BqCvoVK5YcmSQkwxwZT3BlbkFJ2l8VVIGR8khKASvZHEEk`
          }
        }
      );
      return response;
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        console.warn(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return makeRequestWithRetry(newMessages, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  return (
    <div>
      <div className={styles.emoticon} onClick={toggleExpanded}>
        <img src={ChatGptLogo} alt="Chat Icon" />
      </div>

      {expanded && (
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            {messages.map((message, index) => (
              <p key={index} style={{ textAlign: message.role === 'user' ? 'right' : 'left' }}>
                {message.content}
              </p>
            ))}
            <input value={input} onChange={handleInputChange} onKeyPress={event => event.key === 'Enter' ? sendMessage() : null} />
            <button onClick={sendMessage} disabled={isLoading}>Send</button>
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGpt;
