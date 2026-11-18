# BRACU Research Connect (Frontend)

> **A full-stack thesis management and research collaboration portal for BRAC University CSE students, supervisors, and administrators.**

🌐 **Live Site:** [https://brac-research-connect.vercel.app/](https://brac-research-connect.vercel.app/)  
🔗 **Backend API:** [https://bracu-research-server-teal.vercel.app/](https://bracu-research-server-teal.vercel.app/)

---

## Repositories

* **Frontend (Client):** [Akhlakur07/BRAC-Research-Connect](https://github.com/Akhlakur07/BRAC-Research-Connect)
* **Backend (Server):** [Akhlakur07/BRACU-Research-server](https://github.com/Akhlakur07/BRACU-Research-server)

---

## Key Features

* **Live BRACU CSE Directories:**
  * **Supervisors (`/supervisors`):** Browse live BRACU CSE faculty supervising statuses, designations, and profiles (paginated 18 per page) synced from `cse.bracu.ac.bd/thesis/supervising/list`.
  * **Thesis Synopsis (`/synopsis`):** Explore live thesis topic synopses offered by faculty (paginated 12 per page) with full detail modals synced from `cse.bracu.ac.bd/thesis/synopsis`.
  * **Thesis Process (`/thesis-process`):** Complete BRACU CSE Pre-Thesis I & II, CSE400, marking rubrics, plagiarism limits, and submission guidelines.
* **Role-Based Dashboards (Student / Supervisor / Admin):**
  * **Students:** Create/join research groups (up to 5 members), submit thesis proposals, track proposal status & supervisor feedback, search & bookmark **arXiv** research papers, view recommended papers, and check scheduled meetings.
  * **Supervisors:** Review received proposals, approve/reject with semester assignment, leave feedback, recommend arXiv papers to groups, and schedule meetings.
  * **Admins:** Manage users, assign supervisors to groups by upcoming semester, manage semesters, publish system announcements, and create FAQs.
* **UI & UX:**
  * White & BRACU-purple (`#7b1e3c`) theme with `Plus Jakarta Sans` & `Inter` typography
  * Transparent, glassmorphic sticky navbar with **Research** and **Student Hub** dropdowns
  * **Lenis** smooth scrolling with automatic scroll-to-top on route navigation and themed scrollbar

---

## Project Structure

```text
BRAC-Research-Connect/
├── public/
├── src/
│   ├── components/
│   │   ├── FuzzyText.jsx
│   │   ├── SmoothScroll.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/Auth/
│   ├── firebase/
│   │   └── firebase.init.js
│   ├── layouts/
│   │   └── RootLayout.jsx
│   ├── pages/
│   │   ├── Admin/           (AssignSupervisor.jsx, CreateFaqs.jsx, ManageUsers.jsx)
│   │   ├── Announcement/    (Announcement.jsx, ViewAnnouncements.jsx)
│   │   ├── Authentication/  (Login.jsx, Register.jsx)
│   │   ├── Dashboard/       (AdminDashboard.jsx, StudentDashboard.jsx, SupervisorDashboard.jsx)
│   │   ├── Error/           (Error.jsx)
│   │   ├── FAQs/            (AllFaqs.jsx)
│   │   ├── Home/            (Home.jsx, HeroSection.jsx, Search.jsx, ThesisWorkflow.jsx, RecentFAQs.jsx)
│   │   ├── Meeting/         (ScheduleMeetings.jsx)
│   │   ├── Semester/        (Semester.jsx)
│   │   ├── Shared/          (Navbar.jsx, Footer.jsx)
│   │   ├── Student/         (Profile.jsx, Recommended.jsx, Savedpapers.jsx, Searchpaper.jsx)
│   │   ├── StudentGroup/    (CreateGroup.jsx, FindGroup.jsx)
│   │   ├── SupGroups/       (SupervisorGroups.jsx)
│   │   ├── Supervisor/      (SupervisorsList.jsx, SupervisorProfile.jsx)
│   │   ├── Synopsis/        (SynopsisList.jsx)
│   │   └── Thesis/          (AllThesis.jsx, ThesisProcess.jsx, ThesisProposalForm.jsx, ViewProposals.jsx, ViewRecievedProposals.jsx)
│   ├── Private/
│   ├── routers/
│   │   └── router.jsx
│   ├── index.css
│   └── main.jsx
├── .env.production
├── vercel.json
└── package.json
```

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite 7, React Router 7, Tailwind CSS v4, DaisyUI 5, Lucide React, Lenis |
| **Authentication** | Firebase Authentication |
| **Notifications** | React Toastify, SweetAlert2 |
| **Backend API** | Node.js, Express 5, MongoDB (deployed on Vercel) |
| **Deployment** | Vercel (with SPA rewrites via `vercel.json`) |

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Akhlakur07/BRAC-Research-Connect.git
cd BRAC-Research-Connect
npm install
```

### 2. Configure local environment (`.env.local`)
Create a `.env.local` file in the root directory for local development against the local backend (`http://localhost:3000`):

```env
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
VITE_API_URL=http://localhost:3000
```

> Production builds on Vercel automatically use `.env.production` (`VITE_API_URL=https://bracu-research-server-teal.vercel.app`).

### 3. Run locally
```bash
npm run dev
```

### 4. Production build
```bash
npm run build
```

---

## License

This project is licensed under the **MIT License**.
