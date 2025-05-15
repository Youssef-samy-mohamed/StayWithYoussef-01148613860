StayWithYoussef 🏨

Welcome to StayWithYoussef, a hotel booking platform where users can browse hotels, book rooms, and manage their stays with ease. Admins can manage hotels, rooms, and bookings through a dedicated dashboard. Built with a modern tech stack, this project aims to provide a seamless experience for travelers and administrators alike.

📋 Project Overview

StayWithYoussef allows users to:





Sign up or log in to their accounts.



Browse hotels by location, view amenities, and check room availability.



Book rooms by selecting check-in/check-out dates and confirming details.



Admins can manage hotels, rooms, and user bookings via an intuitive dashboard.

Tech Stack





Frontend: React, TypeScript, Tailwind CSS



Backend: Node.js, Express.js, PostgreSQL



Authentication: JWT (JSON Web Tokens)



Database: PostgreSQL (with tables for users, hotels, rooms, tags, hotel_tags, bookings)

🚀 Getting Started

Follow these steps to set up and run the StayWithYoussef project on your local machine.

Prerequisites

Ensure you have the following installed:





Node.js (v16 or higher): Download



PostgreSQL (v12 or higher): Download



Git: Download



A code editor like VS Code.

Project Structure





backend/: Contains the Node.js/Express backend code, API routes, and database setup.



frontend/: Contains the React/TypeScript frontend code, components, and hooks.

1. Clone the Repository

Clone the project to your local machine:

git clone https://github.com/your-username/staywithyoussef.git
cd staywithyoussef

2. Set Up the Backend

a. Navigate to the Backend Directory

cd backend

b. Install Dependencies

Install the required Node.js packages:

npm install

c. Configure the Database





Ensure PostgreSQL is running on your machine.


my db.js is

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;




Create a database named stay_with_youssef:

psql -U postgres
CREATE DATABASE stay_with_youssef;
\q



Copy the .env.example file to create a .env file:

cp .env.example .env


my .env is like : 


DB_HOST=localhost
DB_PORT=5432
DB_NAME=staywithyoussef
DB_USER=
DB_PASSWORD=
JWT_SECRET=




Edit the backend/.env file with your local configuration:

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/stay_with_youssef?schema=public
JWT_SECRET=your_jwt_secret_key
PORT=5000





Replace your_password with your PostgreSQL password (e.g., the password you set for the postgres user).



Replace your_jwt_secret_key with a secure secret key for JWT (e.g., generate a random string like mysecretkey123).



Adjust the PORT if needed (default is 5000).

d. Set Up the Database Schema and Seed Data





Run the schema setup script to create tables:

psql -U postgres -d stay_with_youssef -f db/schema.sql

The schema.sql file creates tables for users, hotels, rooms, tags, hotel_tags, and bookings.



(Optional) Seed the database with test data:

psql -U postgres -d stay_with_youssef -f db/insert-data.sql

This adds sample users, hotels, rooms, and bookings.

e. Run the Backend

Start the backend server:

npm run dev

The server will run on http://localhost:5000. You can test API endpoints like:





GET /hotels: Fetch all hotels.



POST /booking: Create a booking (requires authentication).

3. Set Up the Frontend

a. Navigate to the Frontend Directory

cd ../frontend

b. Install Dependencies

Install the required packages:

npm install

c. Configure Environment Variables





Copy the .env.example file to create a .env file:

cp .env.example .env



Edit the frontend/.env file to point to your backend API:

REACT_APP_API_URL=http://localhost:5000





Ensure the REACT_APP_API_URL matches the port your backend is running on (default is 5000).

d. Run the Frontend

Start the React development server:

npm run dev

The frontend will run on http://localhost:3000. Open this URL in your browser to access the app.

4. Explore the App





Regular User:





Sign up or log in (e.g., use john.doe@example.com with password hashedpassword123 if using seed data).



Browse hotels (e.g., Skyline Retreat, Sunset Resort).



Select a hotel, choose a room, and book by entering dates and guest details.



Admin:





Log in as an admin (e.g., admin@example.com with password hashedpassword123).



Navigate to /admin/dashboard to access the Admin Dashboard.




project digram overview : 


<div align="center">
  <img src="https://github.com/user-attachments/assets/7fcc519e-1bb6-4947-95a5-9ffba85c1d8b" alt="StayWithYoussef ERD" width="600"/>
</div>
