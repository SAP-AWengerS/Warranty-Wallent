<p align="center">
  <img src="frontend/public/ww_logo.png" alt="Warranty Wallet Logo" width="100"/>
</p>

<h1 align="center">Warranty Wallet</h1>

<p align="center">
  Open-source warranty management web application built with React, Ant Design, Node.js, Express & MongoDB.
  <br/>
  <i>Effortlessly organize and track all your warranties in one place.</i>
</p>

<p align="center">
  <a href="https://warranty-wallet.vercel.app" target="_blank">
    🌐 <b>Live Demo</b>
  </a> •
  <a href="#-project-overview">
    📖 <b>About</b>
  </a> •
  <a href="#-getting-started">
    ⚙️ <b>Setup</b>
  </a> •
  <a href="#-running-tests">
    🧪 <b>Tests</b>
  </a> •
  <a href="#-contributing">
    🤝 <b>Contribute</b>
  </a> •
  <a href="#-license">
    🪪 <b>License</b>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square" alt="Made with love"/>
  <img src="https://img.shields.io/badge/Open%20Source-Yes-blue?style=flat-square" alt="Open Source"/>
</p>

---

# Project Overview

**Warranty Wallet** is a cloud-based web application that helps users store, manage, and track their product warranties digitally.
It allows uploading warranty bills, tracking warranty periods with automated reminders, and sharing warranty access securely.

⭐ Star this repo if you found it helpful! </p>

---

# Features

- 📄 **Upload Warranty Bills** – Store and manage your product receipts securely on the cloud.
- 🧾 **Centralized Management** – Organize warranty details in a single, easy-to-access dashboard.
- 🔔 **Expiry Notifications** – Automated reminders via AWS SNS before warranties expire.
- 👥 **Collaborative Access** – Share warranty details with others for group tracking.
- 💻 **Cross-Platform Interface** – Responsive and accessible on all devices.
- 🎨 **Modern UI** – Powered by React and Ant Design.

---

# Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Ant Design, Bootstrap |
| **Backend** | Node.js, Express |
| **Database** | MongoDB |
| **Testing** | Jest, React Testing Library |
| **Cloud & Hosting** | AWS EC2, AWS S3, AWS SNS, Vercel, Render |
| **Language** | JavaScript (ES6) |

---

# Getting Started

Follow these steps to set up the project locally:

1️⃣ Clone the repository

```
git clone https://github.com/SAP-AWengerS/Warranty-Wallent/
cd warranty-wallet
```

2️⃣ Setup Backend

```
cd server
cp .env.example .env
npm install
npm start
```

.env file for backend:

```env
REDIRECT_URL="https://warrenty-wallet.vercel.app"
SECRETKEY=secret
MONGODB_URL=
AWS_SECRET_ACCESS_KEY =
AWS_ACCESS_KEY_ID =
CORS_URLS = ['http://localhost:3000', 'https://managemytruck.me', 'https://www.managemytruck.me']
```

3️⃣ Setup Frontend

```
cd client
cp .env.example .env
npm install
npm start
```

.env file for frontend:

```
REACT_APP_BACKEND_URL=https://warranty-wallet-backend-1.onrender.com
REACT_APP_GOOGLE_URL=
```

Your app will now be running at:

```
Frontend → http://localhost:3000
Backend → http://localhost:8000
```

## 🧪 Running Tests

We use **Jest** and **React Testing Library** for comprehensive unit and integration testing.

### Frontend Tests

Navigate to the frontend directory and run tests:

```bash
cd frontend

# Run all tests
npm test

# Run tests without watch mode (CI/CD)
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test Dashboard.test.jsx
npm test Filters.test.jsx
```

### Test Structure

Tests are co-located with their respective components following React best practices:

```
frontend/src/
├── Pages/
│   └── Dashboard/
│       ├── Dashboard.js
│       └── Dashboard.test.jsx      # Dashboard component tests
└── Components/
    └── Filters/
        ├── Filters.js
        └── Filters.test.jsx        # Filters component tests
```

### Test Coverage

Current test suites cover:

**Dashboard Component (`Dashboard.test.jsx`)**
- ✅ Loading states and spinners
- ✅ API data fetching and rendering
- ✅ Empty state handling
- ✅ Search functionality and filtering
- ✅ Error handling and graceful failures

**Filters Component (`Filters.test.jsx`)**
- ✅ Component rendering and UI elements
- ✅ User interactions and event handling  
- ✅ Search input functionality
- ✅ Category filtering

### Writing New Tests

When adding new components, create test files following this pattern:

1. **File Naming**: `ComponentName.test.jsx`
2. **Location**: Same directory as the component
3. **Structure**: Use React Testing Library patterns
4. **Mocking**: Mock external dependencies (APIs, contexts, etc.)

Example test structure:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  test('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```
---

# Folder Structure
```
warranty-wallet/
│
├── frontend/           # React + Ant Design frontend
│   ├── src/
│   │   ├── Pages/
│   │   │   └── Dashboard/
│   │   │       ├── Dashboard.js
│   │   │       └── Dashboard.test.jsx    # Dashboard tests
│   │   ├── Components/
│   │   │   └── Filters/
│   │   │       ├── Filters.js
│   │   │       └── Filters.test.jsx      # Filters tests
│   │   └── setupTests.js                 # Jest setup
│   ├── public/
│   └── package.json
│
├── backend/            # Node.js + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
│
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md

```
```
warranty-wallet/
│
├── client/             # React + Ant Design frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/             # Node.js + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
│
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md

```
---

# Cloud Setup

Warranty Wallet leverages AWS for scalable and reliable deployment:

EC2: Hosts the Node.js backend server.

S3: Stores uploaded warranty bill images securely.

DocumentDB: Stores user and warranty data in NoSQL format.

SNS: Sends notifications 10 days before warranty expiry.

Vercel: Hosts the frontend React app.

---

# Contributing

We ❤️ contributions from the open-source community!

1️⃣ Fork the repository

2️⃣ Create your feature branch
```
git checkout -b feature/my-feature

```
3️⃣ Commit your changes
```
git commit -m "Add: new feature"

```
4️⃣ Push to your branch
```
git push origin feature/my-feature

```
5️⃣ Open a Pull Request 🚀

For detailed contribution rules, see [CONTRIBUTING.md](./CONTRIBUTING.md).
For testing guidelines and best practices, see [TESTING.md](./TESTING.md).

---

# License

This project is licensed under the MIT License. You’re free to use, modify, and distribute this software with attribution.

---

# Contributors

| [<img src="https://avatars.githubusercontent.com/u/85933206?v=4" width="100" height="100" style="border-radius:50%"/>](https://github.com/brindas) | [<img src="https://avatars.githubusercontent.com/u/73706705?s=400&u=150831dea33fa9328172f02f5b05c4e9bc1e1b18&v=4" width="100" height="100" style="border-radius:50%"/>](https://github.com/ebytom) | [<img src="https://avatars.githubusercontent.com/u/79135241?v=4" width="100" height="100" style="border-radius:50%"/>](https://github.com/govindmj) | [<img src="https://avatars.githubusercontent.com/u/85976132?v=4" width="100" height="100" style="border-radius:50%"/>](https://github.com/joyaldevassy) | [<img src="https://avatars.githubusercontent.com/u/79042847?v=4" width="100" height="100" style="border-radius:50%"/>](https://github.com/nehabimal) |
|:--:|:--:|:--:|:--:|:--:|
| **Brinda S** | **Eby Tom** | **Govind M J** | **Joyal Devassy** | **Neha Bimal** |
---

# Future Scope

📆 Add warranty claim tracking & analytics

📱 Develop mobile application version

🔍 Integrate smart receipt scanning

📊 Dashboard for warranty usage insights

---

# Contact

**Maintainer:** CodHub 📧 [dev.codhub@gmail.com](mailto:dev.codhub@gmail.com)



<p align="center"> Made with ❤️ by <b>Team AWengerS</b>

