// .env file.
require('dotenv').config();
const fetch = require('node-fetch');

const CANVAS_TOKEN = process.env.CANVAS_TOKEN;
const CANVAS_URL = process.env.CANVAS_URL;

// Function call to get all assigments from canvas:
async function getAssignments() {
    try {
        const response = await fetch(`${CANVAS_URL}/users/self/upcoming_assignments`, {
            headers: {
                'Authorization': `Bearer ${CANVAS_TOKEN}`
            }
        });

        const data = await response.json();

        console.log('\n=== YOUR UPCOMING ASSIGNMENTS ===\n');
        data.forEach(assignment => {
            const dueDate = assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'No due date';
            console.log(`📚 ${assignment.name}`);
            console.log(`   Course: ${assignment.course_id}`);
            console.log(`   Due: ${dueDate}\n`);
        });

    } catch (error) {
        console.error('Error fetching assignments:', error.message);
    }
}

getAssignments();