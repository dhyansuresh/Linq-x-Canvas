const { handleIncomingMessage } = require('./message-handler');
const fs = require('fs');

// Track the last processed message ID to avoid duplicates
let lastProcessedMessageId = null;

// Load last processed message ID from file (persists across restarts)
function loadLastMessageId() {
    try {
        if (fs.existsSync('last-message.txt')) {
            lastProcessedMessageId = fs.readFileSync('last-message.txt', 'utf8').trim();
            console.log(`📋 Loaded last message ID: ${lastProcessedMessageId}`);
        }
    } catch (error) {
        console.log('No previous message ID found, starting fresh');
    }
}

// Save last processed message ID
function saveLastMessageId(messageId) {
    try {
        fs.writeFileSync('last-message.txt', messageId);
        lastProcessedMessageId = messageId;
    } catch (error) {
        console.error('Failed to save message ID:', error.message);
    }
}

// Check for new messages and process them
async function checkForMessages() {
    try {
        const { getMostRecentMessage } = require('./get-messages');
        const message = await getMostRecentMessage();

        // Skip if we've already processed this message
        if (message.messageId === lastProcessedMessageId) {
            console.log('  No new messages');
            return;
        }

        // Skip messages from yourself
        if (message.isFromMe) {
            console.log('  Message from self - skipping');
            saveLastMessageId(message.messageId);
            return;
        }

        console.log('\n NEW MESSAGE DETECTED!');
        console.log(`From: ${message.from}`);
        console.log(`Text: "${message.text}"\n`);

        // Process the message
        const result = await handleIncomingMessage();

        // Mark as processed
        saveLastMessageId(message.messageId);

        console.log(`\n Processed successfully (${result.type})\n`);
        console.log('=' .repeat(50) + '\n');

    } catch (error) {
        console.error('Error checking messages:', error.message);
    }
}

// Main polling loop
async function startBot() {
    console.log('Linq x Canvas Bot - LIVE MODE');
    console.log('=' .repeat(50));
    console.log('Running 24/7');
    console.log('Checking for new messages every 30 seconds...');
    console.log('Press Ctrl+C to stop\n');
    console.log('=' .repeat(50) + '\n');

    // Load the last processed message ID
    loadLastMessageId();

    // Check immediately on startup
    await checkForMessages();

    // Then check every 30 seconds
    setInterval(async () => {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] 🔍 Checking for new messages...`);
        await checkForMessages();
    }, 5000); // 5 seconds
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Bot shutting down gracefully...');
    console.log('Last processed message saved.');
    process.exit(0);
});

// Start the bot
startBot();