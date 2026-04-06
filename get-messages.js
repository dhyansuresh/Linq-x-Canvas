require('dotenv').config();
const fetch = require('node-fetch');

const LINQ_API_TOKEN = process.env.LINQ_API_TOKEN;
const LINQ_PHONE = process.env.LINQ_PHONE_NUMBER;
const LINQ_MESSAGES_URL = process.env.LINQ_MESSAGES_URL;


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
            console.log("Messages retrieved")
            console.log(data)
            console.log(data.messages.length)
            for (let i = 0; i < data.messages.length; i++) {
                for (let j = 0; j < data.messages[i].parts.length; j++) {
                    const part = data.messages[i].parts[j];
                    if (part.type === 'text') {
                        console.log(part.value)
                    }
                }
            }

        } else {
            console.log('Error:', response.status)
            console.log(data)
        }
    } catch (error) {
         console.error(error.message)
    }
}


getMessages()

