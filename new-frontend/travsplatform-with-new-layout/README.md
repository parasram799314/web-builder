# travsplatform — Frontend

A React + Firebase travel agent platform with holiday calendar, package management, and shareable client pages.

---

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Open `src/firebase/config.js` and replace the placeholder values with your Firebase project config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

**Firebase services to enable:**
- ✅ Authentication → Email/Password
- ✅ Firestore Database (start in test mode for development)
- ✅ Storage (for logo uploads)

### 3. Run the app
```bash
npm start
```

---

## 📁 Project Structure

```
src/
├── App.js                        # Routes: /auth, /admin, /view/:userId
├── firebase/
│   └── config.js                 # Firebase configuration (fill in your values)
├── context/
│   ├── AuthContext.js            # Firebase auth state
│   └── PageContext.js            # Firestore page data + save/load
├── data/
│   └── holidays.js               # Holiday data for India, UK, USA, Australia, Canada, UAE
├── pages/
│   ├── AuthPage.jsx              # Login / Signup
│   ├── AdminPage.jsx             # Protected admin dashboard
│   └── ViewPage.jsx              # Public read-only client view
└── components/
    ├── Navbar/
    │   ├── Navbar.jsx            # Public navbar (shows branding)
    │   └── AdminNavbar.jsx       # Admin navbar (sign out, generate link)
    ├── Admin/
    │   ├── AdminToolbar.jsx      # Branding editor + contact form toggle + save
    │   └── GenerateLinkModal.jsx # Publish page + copy shareable link
    ├── Calendar/
    │   └── Calendar.jsx          # Holiday calendar with long weekend detection
    ├── Packages/
    │   ├── PackagesList.jsx      # Grid of packages
    │   ├── PackageCard.jsx       # Individual package card
    │   └── PackageModal.jsx      # Add / Edit package modal
    ├── ContactForm/
    │   └── ContactForm.jsx       # Contact inquiry form
    └── RightPanel/
        └── RightPanel.jsx        # Sidebar: compare holidays + contact form + social
```

---

## 🔑 App Routes

| Route | Description |
|-------|-------------|
| `/auth` | Login / Signup for travel agents |
| `/admin` | Protected admin dashboard (requires login) |
| `/view/:userId` | Public read-only page for clients |

---

## ✨ Features

- **Admin Dashboard** — Customize branding (company name or logo), manage packages (add/edit/delete), toggle contact form, select countries for holiday comparison
- **Holiday Calendar** — Multi-country holiday data (India, UK, USA, Australia, Canada, UAE) with long weekend detection and "take leave" suggestions
- **Package Management** — Full CRUD with image preview, title, duration, price
- **Generate Link** — Publish your page and share a unique URL with clients
- **Client View** — Read-only page showing the agent's customized content
- **Firebase Backend** — Auth, Firestore for page data, Storage for logos

---

## 🔧 Dependencies

- React 18
- React Router DOM 6
- Firebase 10
- Tailwind CSS (via CDN in public/index.html)
