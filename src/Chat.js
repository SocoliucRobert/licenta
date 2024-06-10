import React, { useState } from 'react';
import axios from 'axios';

function Chat() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { prompt });
      setResponses([...responses, response.data]);
      setPrompt('');  // Clear input after submission
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={prompt} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {responses.map((res, index) => (
          <li key={index}>{res.choices[0].message.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
