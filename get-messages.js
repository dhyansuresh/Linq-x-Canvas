require('dotenv').config();
const fetch = require('node-fetch');

const LINQ_API_TOKEN = process.env.LINQ_API_TOKEN;
const LINQ_PHONE = process.env.LINQ_PHONE_NUMBER;
const LINQ_MESSAGES_URL = process.env.LINQ_MESSAGES_URL;

// Get all messages.
async function getMessages() {
    try {
        const response = await fetch(`${LINQ_MESSAGES_URL}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${LINQ_API_TOKEN}`  ,
                "Accept": "*/*"
            },
        });


        const data = await response.json();

        if (response.ok) {
            return data
        } else {
            throw new Error(`Error status: ${response.status}`)
        }
    } catch (error) {
         console.error(error.message)
        throw error
    }
}

// Get the most recently sent message:
async function getMostRecentMessage() {
    try {
        const data = await getMessages();

        if (!data.messages || data.messages.length === 0) {
            throw new Error('No messages found');
        }

        // Sort by created_at timestamp (newest first)
        const sortedMessages = data.messages.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        const mostRecent = sortedMessages[0];

        // Extract text from all text parts
        let text = '';
        if (mostRecent.parts && mostRecent.parts.length > 0) {
            for (let j = 0; j < mostRecent.parts.length; j++) {
                const part = mostRecent.parts[j];
                if (part.type === 'text') {
                    text += part.value + ' ';
                }
            }
        }

        return {
            text: text.trim(),
            timestamp: mostRecent.created_at,
            messageId: mostRecent.id,
            from: mostRecent.from_handle.handle,
            isFromMe: mostRecent.is_from_me,
            fullMessage: mostRecent
        };
    } catch (error) {
        console.error('Error getting most recent message:', error.message);
        throw error;
    }
}

module.exports = {
    getMessages,
    getMostRecentMessage
};



