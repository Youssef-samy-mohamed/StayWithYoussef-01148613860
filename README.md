<div align="center">
  <h1>🏨 StayWithYoussef</h1>
  <p>A modern hotel booking platform</p>
</div>

---

<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2>📋 Project Overview</h2>
  <p>Welcome to StayWithYoussef, a hotel booking platform where users can browse hotels, book rooms, and manage their stays with ease. Admins can manage hotels, rooms, and bookings through a dedicated dashboard. Built with a modern tech stack, this project aims to provide a seamless experience for travelers and administrators alike.</p>

  <h3>Features</h3>
  <ul>
    <li>Sign up or log in to accounts</li>
    <li>Browse hotels by location with amenities and availability</li>
    <li>Book rooms with date selection</li>
    <li>Admin dashboard for hotel and booking management</li>
  </ul>
</div>

---

<div style="background-color: #e9f5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2>🛠 Tech Stack</h2>
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
    <div>
      <h4>Frontend</h4>
      <ul>
        <li>React / vite</li>
        <li>TypeScript</li>
        <li>Tailwind CSS</li>
      </ul>
    </div>
    <div>
      <h4>Backend</h4>
      <ul>
        <li>Node.js</li>
        <li>Express.js</li>
        <li>PostgreSQL</li>
      </ul>
    </div>
    <div>
      <h4>Authentication</h4>
      <ul>
        <li>JWT</li>
      </ul>
    </div>
  </div>
</div>

---

<div style="background-color: #fff4e6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2>🚀 Getting Started</h2>
  
  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (v16+)</li>
    <li>PostgreSQL (v12+)</li>
    <li>Git</li>
    <li>Code editor (VS Code recommended)</li>
  </ul>

  <h3>Project Structure</h3>
  <pre>
  staywithyoussef/
  ├── backend/       # Node.js/Express backend
  └── frontend/      # React frontend
  </pre>
</div>

---

<div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2>🔧 Installation</h2>
  
  <h3>1. Clone the Repository</h3>
  <pre>git clone https://github.com/your-username/staywithyoussef.git
cd staywithyoussef</pre>

  <h3>2. Backend Setup</h3>
  <h4>Install dependencies:</h4>
  <pre>cd backend
npm install</pre>

  <h4>Database Configuration:</h4>
  <p>Create PostgreSQL database:</p>
  <pre>psql -U postgres
CREATE DATABASE stay_with_youssef;
\q</pre>

  <h4>Environment Variables:</h4>
  <p>Configure <code>.env</code> file:</p>
  <pre>DB_HOST=localhost
DB_PORT=5432
DB_NAME=staywithyoussef
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key</pre>

  <h4>Run the backend:</h4>
  <pre>npm run dev</pre>
</div>

---

<div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h3>3. Frontend Setup</h3>
  <h4>Install dependencies:</h4>
  <pre>cd ../frontend
npm install</pre>

  <h4>Configure environment:</h4>
  <pre>REACT_APP_API_URL=http://localhost:5000</pre>

  <h4>Run the frontend:</h4>
  <pre>npm run dev</pre>
</div>

---



  <h3>Tables & Relationships</h3>
  <details>
    <summary><strong>📝 SQL Schema</strong></summary>
    <pre>
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hotels table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    location VARCHAR(255),
    images JSON,
    check_in VARCHAR(10),
    check_out VARCHAR(10),
    cancellation_policy TEXT,
    amenities JSON,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    hotelid INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    bed_type VARCHAR(100),
    max_guests INTEGER NOT NULL,
    price_per_night NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    amenities JSON,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create hotel_tags table (junction table for hotels and tags)
CREATE TABLE hotel_tags (
    hotelid INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    tagid INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (hotelid, tagid)
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INTEGER NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    price_per_night NUMERIC(10,2),
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);
    </pre>
  </details>

  <h3>🔗 Key Relationships</h3>
  <ul>
    <li><strong>Users ↔ Bookings</strong>: One-to-many (<code>bookings.user_id</code> references <code>users.id</code>).</li>
    <li><strong>Hotels ↔ Rooms</strong>: One-to-many (<code>rooms.hotelid</code> references <code>hotels.id</code>).</li>
    <li><strong>Hotels ↔ Bookings</strong>: One-to-many (<code>bookings.hotel_id</code> references <code>hotels.id</code>).</li>
    <li><strong>Hotels ↔ Tags</strong>: Many-to-many (via <code>hotel_tags</code> junction table).</li>
  </ul>
</div>

---

<div style="background-color: #fff0f5; padding: 20px; border-radius: 8px;">
  <h2>👨‍💻 Usage</h2>
  <h3>Regular User</h3>
  <ul>
    <li>Sign up or log in</li>
    <li>Browse hotels and rooms</li>
    <li>Make bookings</li>
  </ul>

  <h3>Admin</h3>
  <ul>
    <li>Log in with admin credentials</li>
    <li>Access dashboard at <code>/admin/dashboard</code></li>
    <li>Manage hotels, rooms, and bookings</li>
  </ul>
</div>

---

<div align="center" style="margin-top: 30px;">
  <h3>Enjoy your stay with StayWithYoussef! 🏨</h3>
</div>

<div style="background-color: #f0fff0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2>📊 Project overview </h2>
  <div align="center">
    <img src="https://github.com/user-attachments/assets/7fcc519e-1bb6-4947-95a5-9ffba85c1d8b" alt="StayWithYoussef ERD" width="600"/>
  </div>
