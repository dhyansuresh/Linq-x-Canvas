require('dotenv').config();
const fetch = require('node-fetch');

const CANVAS_TOKEN = process.env.CANVAS_TOKEN;
const CANVAS_URL = process.env.CANVAS_URL;

async function getUpcomingAssignments() {
    try {

        console.log('Fetching courses...\n');
        const coursesResponse = await fetch(`${CANVAS_URL}/courses?enrollment_state=active`, {
            headers: { 'Authorization': `Bearer ${CANVAS_TOKEN}` }
        });
        const courses = await coursesResponse.json();

        // Step 2: Get assignments for each course
        console.log('=== UPCOMING ASSIGNMENTS ===\n');

        const now = new Date();
        let allAssignments = [];  // ✅ Store assignments in array

        for (const course of courses) {
            // Fetch assignments for this course
            const assignmentsResponse = await fetch(
                `${CANVAS_URL}/courses/${course.id}/assignments`,
                { headers: { 'Authorization': `Bearer ${CANVAS_TOKEN}` } }
            );

            const assignments = await assignmentsResponse.json();

            // Filter for upcoming assignments (due in the future)
            const upcoming = assignments.filter(assignment => {
                if (!assignment.due_at) return false;
                const dueDate = new Date(assignment.due_at);
                return dueDate > now;
            });

            // Add course info and push to allAssignments
            upcoming.forEach(assignment => {
                allAssignments.push({
                    ...assignment,
                    courseName: course.name,
                    courseCode: course.course_code
                });
            });

            // Display upcoming assignments for this course
            if (upcoming.length > 0) {
                console.log(`📚 ${course.name}\n`);

                upcoming.forEach(assignment => {
                    const dueDate = new Date(assignment.due_at);
                    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

                    console.log(`   ✏️  ${assignment.name}`);
                    console.log(`      Due: ${dueDate.toLocaleDateString()} at ${dueDate.toLocaleTimeString()}`);
                    console.log(`      Days until due: ${daysUntilDue}`);
                    console.log(`      Points: ${assignment.points_possible || 'N/A'}\n`);
                });
            }
        }

        if (allAssignments.length === 0) {
            console.log('🎉 No upcoming assignments! You\'re all caught up.\n');
        } else {
            console.log(`\nTotal upcoming assignments: ${allAssignments.length}`);
        }

        return allAssignments;  // RETURN the assignments!

    } catch (error) {
        console.error('Error:', error.message);
        throw error;  //  Throw so message-handler can catch it
    }
}

module.exports = {
    getUpcomingAssignments
};