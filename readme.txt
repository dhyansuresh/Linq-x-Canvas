# 📱 Linq x Canvas Bot

Automated Canvas assistant that responds to text messages with your assignments, grades, and course info.

## 🎯 What It Does

Text your Linq number and get instant responses:

| You Text | Bot Responds |
|----------|--------------|
| "assignments" / "homework" / "due" | 📚 List of upcoming assignments with due dates |
| "grades" / "scores" | 📊 Current grades for all courses |
| "courses" / "classes" | 📖 Your active courses |

**Response time:** 5-10 seconds

---



## 💬 Usage Examples

**You:** "Show my assignments"
**Bot:** Lists 4 upcoming assignments with due dates

**You:** "What are my grades?"
**Bot:** Shows current grade for each course

**You:** "List my courses"
**Bot:** Displays all active courses

---

## 📋 Files

```
├── main.js              # Bot (runs 24/7)
├── message-handler.js   # Keyword parser
├── get-messages.js      # Fetch messages
├── get-assignments.js   # Fetch assignments
├── get-courses.js       # Fetch courses
├── get-grades.js        # Fetch grades
├── linq-api.js          # Send messages
├── .env                 # Your tokens (DON'T COMMIT!)
└── package.json         # Config
```

---

## 🔧 Configuration

**Change check interval** (main.js line 86):
```javascript
}, 5000); // 5 seconds (current)
}, 10000); // 10 seconds (recommended)
}, 30000); // 30 seconds (conservative)
```

---

## 🧪 Test Locally

```bash
npm install
node main.js
```

Send a text → Wait 5 seconds → Get response!

---

## 🐛 Troubleshooting

**Bot not responding?**
- Check Railway logs (Dashboard → Logs)
- Verify all 4 environment variables are set
- Make sure deployment shows "Success"

**Canvas errors?**
- Regenerate your Canvas token
- Remove trailing slash from CANVAS_URL

**Linq errors?**
- Verify LINQ_MESSAGES_URL has your chat ID
- Check LINQ_API_TOKEN is valid

---

## 📊 Built With

- Node.js + node-fetch
- Canvas LMS API
- Linq Messaging API
- Railway (hosting)

---

Made for busy students