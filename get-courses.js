require('dotenv').config();
const fetch = require('node-fetch');

const CANVAS_TOKEN = process.env.CANVAS_TOKEN;
const CANVAS_URL = process.env.CANVAS_URL;

async function getCourses() {
  console.log('Fetching your courses...\n');

  try {
    const response = await fetch(`${CANVAS_URL}/courses?enrollment_state=active`, {
      headers: {
        'Authorization': `Bearer ${CANVAS_TOKEN}`
      }
    });

    if (!response.ok) {
      console.log('Status:', response.status);
      const text = await response.text();
      console.log('Response:', text.substring(0, 200));
      return;
    }

    const courses = await response.json();

    console.log('=== YOUR ACTIVE COURSES ===\n');
    courses.forEach(course => {
      console.log(`📚 ${course.name}`);
      console.log(`   ID: ${course.id}`);
      console.log(`   Code: ${course.course_code}\n`);
    });

    return courses;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getCourses();