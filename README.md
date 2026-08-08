# CampusDesk

CampusDesk is a campus resource booking system that allows students to browse campus resources, request bookings, and track booking status. Administrators can manage resources and handle booking requests.

---

## 🎥 Demo Video

[▶️ Watch the CampusDesk Demo](https://drive.google.com/file/d/15vHLvbccIwD4gYPrEOGR_0xAK9gwmona/view?usp=share_link)

---

## ✨ Features

### 👨‍🎓 Student

- 🔐 Email OTP-based authentication
- 🔎 Browse available campus resources
- 📋 View resource details and availability
- 📅 Create booking requests
- 📖 View booking history and booking status
- 👤 View profile information
- 📧 Receive booking reminder emails

### 👨‍💼 Administrator

- 🔐 Admin authentication
- 📋 View all booking requests
- ✅ Approve booking requests
- ❌ Reject booking requests
- ➕ Add new campus resources
- ✏️ Edit existing resources
- 🗂️ Manage campus resource information

---

## 🛠️ Tech Stack

| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | OTP + JWT |
| **Email Service** | Nodemailer |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```text
CampusDesk/
│
├── client/              # React frontend
│
├── server/              # Express backend
│
├── DESIGN.md            # Design documentation
├── package.json
└── package-lock.json