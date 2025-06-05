
# 📸 SmartAttend – Smart Attendance System Using Facial Recognition & Location

SmartAttend is a comprehensive web application designed to automate student attendance in educational institutions using facial recognition and geolocation. It ensures secure, accurate, and transparent attendance management for students, teachers, and administrators.

---

## 🔍 Overview

This project solves the common problem of proxy attendance by combining **AI-powered face detection** and **GPS-based location verification**. It provides role-based dashboards for:

- **Admin** – to manage departments, courses, groups, students, and teachers.
- **Teachers** – to schedule and manage classes, control attendance, and share resources.
- **Students** – to mark attendance, access notes, and view their attendance reports.

---

## 🚀 Live Demo

🌐 **Frontend (Vercel):** [Visit Live Site](https://smartattend-rho.vercel.app/)  
🔗 **Backend (Render):** [Live API Link](https://project-52z2.onrender.com)  
📂 **GitHub Repo:** https://github.com/ishika2236/SmartAttend

---

## 🧑‍💼 User Roles & Workflow

### 👩‍💼 Admin
- Create and manage departments (e.g., CSE, MBA).
- Define courses and assign them to departments.
- Add students and assign them to groups.
- Register teachers and assign them to teach specific groups and courses.

### 👨‍🏫 Teacher
- View assigned classrooms and scheduled classes.
- Schedule regular or extra classes.
- Set or edit class location using map-based coordinates.
- Open or close the attendance window for students.
- Manually mark or bulk update attendance.
- Handle edge cases like late arrivals, absentees, or misbehavior.
- Share class materials and announcements.

### 👩‍🎓 Student
- View class schedules and active classrooms.
- Mark attendance using facial recognition and GPS when attendance window is open.
- Access personal attendance history in chart and table format.
- View uploaded notes and class announcements.

---

## ✨ Key Features

- ✅ **Facial Recognition** for student verification (camera-based)
- 🌍 **Geolocation Matching** ensures students are physically present in class
- 📅 **Class Scheduling** by teachers
- 👨‍👩‍👧‍👦 **Group Management** by Admin
- 📊 **Attendance Analytics & Charts** for all users
- 🧠 **Role-based Dashboards** with custom UI
- 📁 **Resource Sharing** (notes & announcements)

---

## 🛠️ Tech Stack

| Frontend     | Backend      | Database   | Authentication | Others           |
|--------------|--------------|------------|----------------|------------------|
| React.js     | Express.js   | MongoDB    | JWT & Cookies  | Cloudinary, MUI  |
| Tailwind CSS | Node.js      | Mongoose   |                | Vercel, Render   |

---



## 📦 Installation & Setup

> Clone the repository:

```bash
git clone https://github.com/ishika2236/SmartAttend.git
cd SmartAttend
```

> Frontend Setup:

```bash
cd frontend
npm install
npm start
```

> Backend Setup:

```bash
cd backend
npm install
npm run dev
```

> Add your `.env` file in the `backend/` folder with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_key
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🧪 Test Credentials

You can create accounts manually or use sample logins:

- Admin: `admin@gmail.com` / `123456Aa`
- Teacher: `testteacher@gmail.com` / `Aa123456`
- Student: `test123@gmail.com` / `Aa123456`



---

## 📈 Future Enhancements

- 🔒 OTP-based secure sign-up
- 📲 Mobile app version with React Native
- 🧠 AI-based attendance trend prediction
- 📢 Real-time notifications

---

## 🙋‍♀️ About Me

Hi! I’m **Ishika Gulati**, a passionate CSE student and developer.  
I love building smart solutions for real-world problems.

🔗 [Connect with me on LinkedIn](https://www.linkedin.com/in/ishika-gulati-b8a64b249/)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
