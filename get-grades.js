require('dotenv').config();
const fetch = require('node-fetch');

const CANVAS_TOKEN = process.env.CANVAS_TOKEN;
const CANVAS_URL = process.env.CANVAS_URL;

async function getGrades() {
    try {
        console.log('Fetching courses with grades...\n');

        // Get all active courses
        const coursesResponse = await fetch(`${CANVAS_URL}/courses?enrollment_state=active`, {
            headers: { 'Authorization': `Bearer ${CANVAS_TOKEN}` }
        });
        const courses = await coursesResponse.json();

        console.log('=== YOUR GRADES ===\n');

        let allGrades = [];

        for (const course of courses) {
            // Get enrollment info (includes grades)
            const enrollmentResponse = await fetch(
                `${CANVAS_URL}/courses/${course.id}/enrollments?user_id=self`,
                { headers: { 'Authorization': `Bearer ${CANVAS_TOKEN}` } }
            );

            const enrollments = await enrollmentResponse.json();

            if (enrollments && enrollments.length > 0) {
                const enrollment = enrollments[0];
                const grades = enrollment.grades || {};

                const gradeInfo = {
                    courseName: course.name,
                    courseCode: course.course_code,
                    currentScore: grades.current_score || null,
                    currentGrade: grades.current_grade || null,
                    finalScore: grades.final_score || null,
                    finalGrade: grades.final_grade || null
                };

                allGrades.push(gradeInfo);

                // Display in terminal
                console.log(`📚 ${course.name}`);
                if (gradeInfo.currentScore !== null) {
                    console.log(`   Current: ${gradeInfo.currentScore}% (${gradeInfo.currentGrade || 'N/A'})`);
                } else {
                    console.log(`   Current: No grade yet`);
                }

                if (gradeInfo.finalScore !== null && gradeInfo.finalScore !== gradeInfo.currentScore) {
                    console.log(`   Final: ${gradeInfo.finalScore}% (${gradeInfo.finalGrade || 'N/A'})`);
                }
                console.log('');
            }
        }

        console.log(`Total courses: ${allGrades.length}\n`);

        return allGrades;

    } catch (error) {
        console.error('Error fetching grades:', error.message);
        throw error;
    }
}

module.exports = {
    getGrades
};