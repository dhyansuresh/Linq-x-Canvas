require('dotenv').config();
const fetch = require('node-fetch');

const LINQ_API_TOKEN = process.env.LINQ_API_TOKEN;
const LINQ_PHONE = process.env.LINQ_PHONE_NUMBER;
const LINQ_BASE_URL = process.env.LINQ_BASE_URL;

async function sendTestMessage() {
    const YOUR_PHONE = '+14074700656';

    try {
        const response = await fetch(`${LINQ_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LINQ_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: LINQ_PHONE,
                to: [YOUR_PHONE],
                message: {
                    parts: [
                        {
                            type: 'text',
                            value: 'hello friends!'
                        }
                    ]
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Message sent successfully!');
            console.log('Response:', data);
        } else {
            console.log('Error sending message');
            console.log('Status:', response.status);
            console.log('Response:', data);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

sendTestMessage();