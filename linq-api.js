require('dotenv').config();
const fetch = require('node-fetch');

const LINQ_API_TOKEN = process.env.LINQ_API_TOKEN;
const LINQ_MESSAGES_URL = process.env.LINQ_MESSAGES_URL;

async function sendMessage(messageText) {

    try {
        const response = await fetch(`${LINQ_MESSAGES_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LINQ_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: {
                    parts: [
                        {
                            type: 'text',
                            value: messageText
                        }
                    ]
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Message Sent')
            return data;
        } else {
            console.error('API Response:', data);
            throw new Error(`Failed to send message: ${response.status} - ${JSON.stringify(data)}`);
        }

    } catch (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }
}

module.exports = {
    sendMessage
};