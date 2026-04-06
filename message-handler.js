const { getMostRecentMessage } = require('./get-messages');
const { getUpcomingAssignments } = require('./get-assignments');
const { getCourses } = require('./get-courses');
const { sendMessage } = require('./linq-api');

// Format assignments into a text message
function formatAssignments(assignments) {
    if (assignments.length === 0) {
        return '🎉 No upcoming assignments! You\'re all caught up.';
    }

    const now = new Date();
    let message = `📚 UPCOMING ASSIGNMENTS (${assignments.length})\n\n`;

    // Limit to first 5 assignments to avoid SMS length limits
    const limited = assignments.slice(0, 5);

    limited.forEach((assignment, index) => {
        const dueDate = new Date(assignment.due_at);
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        message += `${index + 1}. ${assignment.name}\n`;
        message += `   📖 ${assignment.courseName}\n`;
        message += `   📅 Due: ${dueDate.toLocaleDateString()}\n`;
        message += `   ⏰ ${daysUntilDue} days\n`;
        message += `   ⭐ ${assignment.points_possible || 'N/A'} pts\n\n`;
    });

    if (assignments.length > 5) {
        message += `... and ${assignments.length - 5} more`;
    }

    return message.trim();
}

// Format courses into a text message
function formatCourses(courses) {
    if (courses.length === 0) {
        return '❌ No active courses found.';
    }

    let message = `📚 YOUR COURSES (${courses.length})\n\n`;

    courses.forEach((course, index) => {
        message += `${index + 1}. ${course.name}\n`;
        message += `   Code: ${course.course_code}\n\n`;
    });

    return message.trim();
}

// Handle incoming message and route to appropriate Canvas API
async function handleIncomingMessage() {
    try {
        // Get the most recent message from Linq
        console.log('🔍 Fetching most recent message...\n');
        const message = await getMostRecentMessage();

        console.log('=== MESSAGE RECEIVED ===');
        console.log(`From: ${message.from}`);
        console.log(`Time: ${new Date(message.timestamp).toLocaleString()}`);
        console.log(`Text: "${message.text}"`);
        console.log('========================\n');

        // Skip messages from yourself
        if (message.isFromMe) {
            console.log('⚠️  Message is from you - skipping\n');
            return { type: 'skipped', reason: 'Message from self' };
        }

        // Convert to lowercase for keyword matching
        const text = message.text.toLowerCase();

        // Parse keywords and call appropriate Canvas API
        if (text.includes('assignment') || text.includes('homework') || text.includes('due')) {
            console.log('🔍 Detected keyword: ASSIGNMENTS');
            console.log('Fetching assignments from Canvas...\n');

            const assignments = await getUpcomingAssignments();

            console.log('=== UPCOMING ASSIGNMENTS ===\n');
            if (assignments.length === 0) {
                console.log('🎉 No upcoming assignments! You\'re all caught up.\n');
            } else {
                const now = new Date();
                assignments.forEach(assignment => {
                    const dueDate = new Date(assignment.due_at);
                    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

                    console.log(`📚 ${assignment.courseName}`);
                    console.log(`   ✏️  ${assignment.name}`);
                    console.log(`      Due: ${dueDate.toLocaleDateString()} at ${dueDate.toLocaleTimeString()}`);
                    console.log(`      Days until due: ${daysUntilDue}`);
                    console.log(`      Points: ${assignment.points_possible || 'N/A'}\n`);
                });
                console.log(`Total upcoming assignments: ${assignments.length}\n`);
            }

            // Format and send response back via Linq
            const responseText = formatAssignments(assignments);
            console.log('📤 Sending response back to:', message.from);
            await sendMessage(message.from, responseText);

            return { type: 'assignments', data: assignments, sender: message.from, sent: true };

        } else if (text.includes('course') || text.includes('class')) {
            console.log('🔍 Detected keyword: COURSES');
            console.log('Fetching courses from Canvas...\n');

            const courses = await getCourses();

            console.log('=== YOUR COURSES ===\n');
            courses.forEach(course => {
                console.log(`📚 ${course.name}`);
                console.log(`   Code: ${course.course_code}`);
                console.log(`   ID: ${course.id}\n`);
            });
            console.log(`Total courses: ${courses.length}\n`);

            // Format and send response back via Linq
            const responseText = formatCourses(courses);
            console.log('📤 Sending response back to:', message.from);
            await sendMessage(message.from, responseText);

            return { type: 'courses', data: courses, sender: message.from, sent: true };

        } else if (text.includes('grade') || text.includes('score')) {
            console.log('🔍 Detected keyword: GRADES');
            console.log('⚠️  Grades API not yet implemented\n');

            const responseText = '📊 Grades feature coming soon! Try "assignments" or "courses" instead.';
            console.log('📤 Sending response back to:', message.from);
            await sendMessage(message.from, responseText);

            return {
                type: 'grades',
                message: 'Grades feature coming soon!',
                sender: message.from,
                sent: true
            };

        } else {
            console.log('❌ No keyword detected');
            console.log('Try keywords like: assignments, courses, grades\n');

            const responseText = '❓ I didn\'t understand that. Try:\n\n• "assignments" - View homework\n• "courses" - List classes\n• "grades" - View scores (coming soon)';
            console.log('📤 Sending response back to:', message.from);
            await sendMessage(message.from, responseText);

            return {
                type: 'unknown',
                message: 'No recognized keyword',
                sender: message.from,
                sent: true
            };
        }

    } catch (error) {
        console.error('❌ Error handling message:', error.message);
        return { type: 'error', error: error.message };
    }
}

module.exports = {
    handleIncomingMessage
};