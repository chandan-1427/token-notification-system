# Token Notification System (Frontend)

A modern, professional queue management system for clinics, hospitals, or service centers. Built with React, Vite, TailwindCSS, and Socket.IO for real-time updates.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [App Flow](#app-flow)
- [Screenshots & Flowcharts](#screenshots--flowcharts)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [License](#license)

---

## Features

- **Login Authentication** (JWT-based)
- **Add, Serve, Skip, Delete Tokens**
- **Live Queue Display** (for waiting area screens)
- **Search & Filter Patients**
- **Export Data** (CSV, PDF)
- **Real-time Updates** (Socket.IO)
- **Responsive UI** (TailwindCSS)

---

## Tech Stack

- **React 19**
- **Vite** (build tool)
- **TailwindCSS** (styling)
- **Socket.IO Client** (real-time)
- **Axios** (API calls)
- **React Router v7**
- **jsPDF, PapaParse** (export)
- **Lucide Icons**

---

## Folder Structure

```text
frontend/
│
├── src/
│   ├── api/              # API calls (tokenApi.js)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks (useTokens.js)
│   ├── pages/            # Page-level components (Dashboard, DisplayBoard, LoginPage)
│   ├── App.jsx           # Main app router
│   ├── App.css           # Global styles
│   └── index.css         # Tailwind & fonts
│
├── public/
│   └── vite.svg          # Favicon
│
├── .env                  # Environment variables
├── package.json          # Project metadata & scripts
├── vite.config.js        # Vite configuration
└── index.html            # App entry point
```

---

## App Flow

```text
LoginPage --> Dashboard
Dashboard --> TokenForm
Dashboard --> TokenList
Dashboard --> NextToken
Dashboard --> ExportButtons
Dashboard --> SearchInput & TokenFilters
Dashboard --> Open Display --> DisplayBoard
DisplayBoard --> DisplayTokenCard
```

---

## Screenshots & Flowcharts

### Dashboard Structure

```text
Dashboard
├── Header
├── TopActions
├── TokenForm
├── NextToken
├── SearchFilters
└── TokenList
```

### Display Board Structure

```text
DisplayBoard
└── DisplayTokenCard
    ├── CurrentToken
    ├── UpcomingTokens
    └── TotalWaiting
```

---

## Setup & Installation

1. **Clone the repo:**
   ```sh
   git clone https://github.com/chandan-1427/token-notification.git
   cd token-notification/frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment:**
   - Edit `.env`:
     ```env
     VITE_BACKEND_URL=http://localhost:5000/api
     VITE_SOCKET_URL=http://localhost:5000
     ```

4. **Run the app:**
   ```sh
   npm run dev
   ```

---

## Environment Variables

| Variable           | Description                   |
|--------------------|------------------------------|
| VITE_BACKEND_URL   | Backend API base URL         |
| VITE_SOCKET_URL    | Socket.IO server URL         |

---

## Scripts

| Command           | Description                |
|-------------------|---------------------------|
| `npm run dev`     | Start development server  |
| `npm run build`   | Build for production      |
| `npm run lint`    | Run ESLint                |
| `npm run preview` | Preview production build  |

---

## Usage

- **Login:** Enter credentials to access dashboard.
- **Dashboard:** Add new tokens, view/manage queue, export data.
- **Display Board:** For waiting area screens, shows live queue status.
- **Export:** Download queue data as CSV or PDF.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

- UI icons: Lucide
- PDF export: jsPDF
- CSV export: PapaParse
- Real-time: Socket.IO

---

*For backend setup, see the `/backend` folder (not included here).*

---

**Professional, modern, and ready for