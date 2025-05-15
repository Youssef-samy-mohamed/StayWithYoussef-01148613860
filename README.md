StayWithYoussef 🏨
StayWithYoussef is a modern hotel booking platform that allows users to explore hotels, book rooms, and manage their stays seamlessly. It also features a powerful admin dashboard for managing hotels, rooms, and bookings.

📋 Overview
✨ Features
For Users:
📝 Sign up or log in

🏨 Browse hotels by location

🛏️ View amenities and room availability

📅 Book rooms with check-in/check-out dates

For Admins:
🏢 Manage hotels, rooms, and user bookings

📊 Access a secure admin dashboard (/admin/dashboard)
Note: Only accessible to authorized admins

🛠 Tech Stack
Frontend: React, TypeScript, Tailwind CSS

Backend: Node.js, Express.js

Database: PostgreSQL

Authentication: JWT (JSON Web Tokens)

🚀 Getting Started
✅ Prerequisites
Ensure you have the following installed on your machine:

Node.js (v16+)

PostgreSQL (v12+)

Git

VS Code or your preferred code editor

📁 Project Structure
bash
نسخ
تحرير
staywithyoussef/
├── backend/   # Express backend with DB and API routes
└── frontend/  # React frontend with TypeScript and Tailwind CSS
⚙️ Setup Instructions
1. Clone the Repository
bash
نسخ
تحرير
git clone https://github.com/your-username/staywithyoussef.git
cd staywithyoussef
2. Backend Setup
bash
نسخ
تحرير
cd backend
npm install
a. Configure PostgreSQL
Start PostgreSQL and create the database:

sql
نسخ
تحرير
psql -U postgres
CREATE DATABASE stay_with_youssef;
\q
b. Environment Variables
Copy and configure the environment file:

bash
نسخ
تحرير
cp .env.example .env
Update .env with your local configuration:

env
نسخ
تحرير
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/stay_with_youssef?schema=public
JWT_SECRET=your_jwt_secret_key
PORT=5000
Replace your_password with your actual PostgreSQL password
Replace your_jwt_secret_key with a secure random string

c. Initialize Database Schema
bash
نسخ
تحرير
psql -U postgres -d stay_with_youssef -f db/schema.sql
Optional: Add seed data

bash
نسخ
تحرير
psql -U postgres -d stay_with_youssef -f db/insert-data.sql
d. Start Backend Server
bash
نسخ
تحرير
npm run dev
Backend runs at: http://localhost:5000

3. Frontend Setup
bash
نسخ
تحرير
cd ../frontend
npm install
a. Configure Environment
bash
نسخ
تحرير
cp .env.example .env
Edit .env:

env
نسخ
تحرير
REACT_APP_API_URL=http://localhost:5000
b. Run Frontend
bash
نسخ
تحرير
npm run dev
Frontend runs at: http://localhost:3000

🧪 Explore the App
👤 Regular Users:
Sign up or log in (e.g., john.doe@example.com / hashedpassword123 from seed data)

Browse and filter hotels

View hotel details and available rooms

Book by selecting desired dates and guest info

🛠 Admin Access:
Log in as admin (e.g., admin@example.com / hashedpassword123)

Navigate to http://localhost:3000/admin/dashboard

Protected route: Only authorized admins can access

🗂️ Database Overview
Users

Hotels

Rooms

Tags

Hotel_Tags

Bookings

📊 Project Diagram


📧 Contact
For questions, suggestions, or contributions:
📨 samyyoussef@gmail.com

Happy Booking with StayWithYoussef! 🏖️

