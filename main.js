const { handleIncomingMessage } = require('./message-handler');

// Main function to run the bot
async function main() {
    console.log('🤖 Starting Linq x Canvas Bot...\n');
    console.log('=' .repeat(50) + '\n');

    try {
        const result = await handleIncomingMessage();

        console.log('=' .repeat(50));
        console.log('\n✅ Bot completed successfully');
        console.log(`Result type: ${result.type}`);

        if (result.sender) {
            console.log(`Sender: ${result.sender}`);
        }

        if (result.data) {
            console.log(`Data items: ${result.data.length}`);
        }

    } catch (error) {
        console.error('\n❌ Bot failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the bot
main();