# 📘 CodeAcad LMS — Full Stack Learning Management System

CodeAcad is a robust and feature-rich Learning Management System built with the MERN stack. Designed for both learners and administrators, it supports real-time course management, secure lecture delivery, payment integration, and an intuitive user experience.

---

## 🚀 Tech Stack & Tools

### 🖥️ Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge\&logo=redux\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=FFD62E)

### 🧠 Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)

### 🧰 Dev Tools & Libraries

![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge\&logo=JSON%20web%20tokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge\&logo=cloudinary\&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-563D7C?style=for-the-badge\&logo=appveyor\&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge\&logo=razorpay\&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge\&logo=chartdotjs\&logoColor=white)

---

## 📂 Folder Structure

```
codeacad-lms/
├── client/               # React frontend with Redux Toolkit
│   ├── pages/
│   ├── components/
│   ├── redux/
│   └── App.jsx
├── server/               # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── .env                  # Environment variables
└── README.md
```

---

## 🔐 Core Features

### 👩‍🎓 User Functionality

* ✅ Secure registration & login (JWT-based)
* 🏫 Explore courses (filterable by category)
* 📜 View course description & lectures
* 🎬 Watch course videos
* 💳 Subscribe via Razorpay
* 📂 Manage profile & enrolled courses
* 🔐 Change password

### 🛠️ Admin Functionality

* 🧑‍🏫 Add/update/delete courses
* 🎞️ Add/delete lectures to existing courses
* 📊 Dashboard with real-time charts
* 👥 View/manage all users
* 🔄 Role-based access control (ADMIN/USER)
* 💸 Track payments and subscription status

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PrathicaShettyM/CodeAcad.git
cd lms-frontend
cd lms-backend
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

## 📸 UI Screenshots (Add your own screenshots)

* 🏠 Home Page
* 📘 Course Details
* 🛠️ Admin Dashboard
* 💳 Razorpay Checkout

---

## 📡 API Endpoints

### 🔐 Auth Routes

* `POST /api/v1/auth/register` → Register new user
* `POST /api/v1/auth/login` → Login with role check

### 🎓 Course Routes

* `GET /api/v1/courses` → List all courses
* `GET /api/v1/courses/:id` → Course details
* `POST /api/v1/courses/create` → (Admin) Create course
* `PUT /api/v1/courses/:id` → Update course
* `DELETE /api/v1/courses/:id` → Delete course

### 📺 Lecture Routes

* `POST /api/v1/lectures/add/:courseId` → Add lecture to course
* `DELETE /api/v1/lectures/:courseId/:lectureId` → Delete lecture

### 💳 Payment Routes

* `POST /api/v1/payments/checkout` → Start subscription
* `POST /api/v1/payments/verify` → Verify payment
* `GET /api/v1/payments/stats` → Get revenue stats

---

## 🙋‍♀️ About Me

**Prathica Shetty M**
---

## 📃 License

This project is licensed under the **MIT License**.
