# 🌐 Personal Portfolio

A responsive and interactive personal portfolio website built to showcase my skills, projects, and achievements. The portfolio includes a contact form integrated with a Node.js backend and MongoDB for storing user messages.

## 🚀 Live Demo

🌐 **Portfolio Website:** https://portfolio-tan-zeta-13.vercel.app

---

## ✨ Features

- Responsive and modern user interface
- About Me, Skills, and Projects sections
- Contact form with backend integration
- Stores contact messages in MongoDB Atlas
- Clean and user-friendly design


---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## ⚙️ Run Locally

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Create a `.env` file inside the `backend` folder

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. Start the Backend Server

```bash
npm start
```

The backend will run on:

```
http://localhost:5000
```

### 4. Run the Frontend

Open the `frontend` folder in **Visual Studio Code** and launch `index.html` using the **Live Server** extension.

> **Note:** If you are running the project locally, update `frontend/js/config.js` to use:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

For the deployed version, use your Render backend URL:

```javascript
const API_BASE_URL = "https://YOUR_RENDER_URL.onrender.com/api";
```