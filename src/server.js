const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    ...messages
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-proj-lOxbiH21IWwEF5gnHZreT3BlbkFJcN5anW1UTJrKuVEdRvRT`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
