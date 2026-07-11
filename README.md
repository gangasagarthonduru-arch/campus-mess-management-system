# 🍽️ CampusMess — A Daily Mess Menu Portal for Hostel Students

## 💡 The Inspiration

> *“What’s today’s mess menu?”*  
> *“Did anyone check breakfast?”*  
> *“I already went outside… now I have to ask someone.”*

In our hostels, **there is no fixed or easily accessible mess menu**.  
Every single day, students face the same frustrations:

- Asking friends or seniors about the food
- Calling someone just to know the menu
- Going out without knowing what’s being served
- Feeling lazy to ask repeatedly
- No single trusted place to check today’s mess items

We realized this small daily inconvenience wastes time and energy for **hundreds of students**.

That’s where **CampusMess** comes in.

---

## 🚀 What CampusMess Does

**CampusMess** is a **web-based platform** that shows the **daily mess menu** for each hostel and each meal — all in one place.

- No asking people
- No confusion
- No outdated menus

Just open the website and **instantly know what food is being served today**.

---

## 🔁 How It Works (The Flow)

### 1️⃣ Menu Update
- A user adds food items for:
  - A specific **Hostel**
  - A specific **Meal** (Breakfast / Lunch / Dinner)
- Optional food image can be uploaded

### 2️⃣ Storage & Processing
- Menu data is stored in **MongoDB**
- Images are uploaded to **Cloudinary**
- Each menu is tagged with the current date

### 3️⃣ Auto Expiry
- Menus are **automatically valid only for 24 hours**
- Next day → Fresh menu
- No manual cleanup required

### 4️⃣ Viewing the Menu
- Students select:
  - Hostel (Ellora, Hampi, Shilpa, Ajantha, etc.)
  - Meal type
- The website instantly shows **today’s menu**

---

## 📂 Project Architecture & Modules

The project is cleanly divided into **Frontend, Backend, Database, and Cloud Services**.

### 🔹 Frontend (`/public`)
**Purpose:** User interaction and display  

- `index.html` – Main UI
- `main.js` – Logic for:
  - Hostel switching
  - Meal rendering
  - Add item form
  - Modals (Contributors, Report Issue, Notifications)
- `style.css` – Responsive and mobile-friendly design

---

### 🔹 Backend (`server.js`)
**Purpose:** API handling & server logic  

- Express server
- Serves frontend files
- Connects to MongoDB
- Routes API requests
- Handles email notifications

---

### 🔹 Menu Routes (`routes/menuRoutes.js`)
**Purpose:** Core business logic  

- Fetch today’s menus
- Add menu items
- Normalize hostel & meal names
- Upload images to Cloudinary
- Prevent duplicate menu creation
- Auto-create menu if it doesn’t exist

---

### 🔹 Database Models (`models/Menu.js`)
**Purpose:** Data structure & validation  

- Hostel (Enum-based)
- Meal Type (Breakfast / Lunch / Dinner)
- Menu Date
- Items list
- Auto timestamps

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Cloud & Deployment
- Cloudinary (Image uploads)
- Render (Backend hosting)

### Utilities
- Multer (file handling)
- Nodemailer (Report Issue emails)
- dotenv (Environment variables)

---

## 🧠 Key Features

- 🏠 Multiple hostels support
- 🍳 Breakfast / Lunch / Dinner separation
- 🕒 Automatic 24-hour menu expiry
- 📷 Food image upload
- ☁️ Cloud image storage
- 📱 Mobile & desktop responsive UI
- 📝 Report Issue functionality
- 👥 Contributors page
- 🔔 Notifications 

---

## 📦 Installation & Usage

### ▶️ Run Locally

```bash
git clone https://github.com/sathwikre/CampusMess.git
cd CampusMess
npm install
npm start
