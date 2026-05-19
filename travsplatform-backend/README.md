# Travsplatform Backend

Express.js + Firebase Admin SDK backend for the Travsplatform Travel Agent Portal.

## Tech Stack

- **Node.js** + **Express.js**
- **Firebase Admin SDK** (Firestore + Storage + Auth verification)
- **Multer** (logo file uploads)
- **Helmet** + **CORS** + **Rate Limiting** (security)

---

## Project Structure

```
travsplatform-backend/
├── src/
│   ├── index.js                    # Entry point, Express app
│   ├── config/
│   │   └── firebase.js             # Firebase Admin initialization
│   ├── middleware/
│   │   └── auth.js                 # Firebase token verification
│   ├── controllers/
│   │   ├── pagesController.js      # Page CRUD operations
│   │   ├── packagesController.js   # Package CRUD operations
│   │   ├── contactController.js    # Contact inquiry handling
│   │   └── uploadController.js     # Logo image upload
│   └── routes/
│       ├── pages.js
│       ├── packages.js
│       ├── contact.js
│       └── upload.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your Firebase project credentials:

- Go to [Firebase Console](https://console.firebase.google.com)
- Open your project → Project Settings → Service Accounts
- Click **Generate new private key** → download the JSON
- Copy values from that JSON into your `.env`

### 3. Run

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

---

## API Endpoints

### 🔓 Public (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/pages/view/:userId` | Get a published agent's page |
| POST | `/api/contact/:agentId` | Submit inquiry to an agent |

### 🔐 Protected (Requires Firebase ID Token)

Send token in header:
```
Authorization: Bearer <firebase-id-token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages/me` | Get logged-in agent's page data |
| PUT | `/api/pages/me` | Save/update agent's page data |
| POST | `/api/pages/publish` | Publish the page |
| POST | `/api/pages/unpublish` | Unpublish the page |
| GET | `/api/packages` | Get agent's all packages |
| POST | `/api/packages` | Add a new package |
| PUT | `/api/packages/:packageId` | Update a package |
| DELETE | `/api/packages/:packageId` | Delete a package |
| GET | `/api/contact/inquiries` | Get all inquiries received |
| PATCH | `/api/contact/inquiries/:id/read` | Mark inquiry as read |
| POST | `/api/upload/logo` | Upload logo image (multipart/form-data) |

---

## Request / Response Examples

### Save page data
```http
PUT /api/pages/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "branding": { "type": "text", "value": "My Travel Co" },
  "countries": ["india", "usa"],
  "packages": [],
  "showContactForm": true,
  "calendarYear": 2026,
  "published": false
}
```

### Get public page
```http
GET /api/pages/view/USER_UID_HERE
```

### Submit contact inquiry
```http
POST /api/contact/USER_UID_HERE
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "message": "I need a package for 5 people to Goa"
}
```

### Upload logo
```http
POST /api/upload/logo
Authorization: Bearer <token>
Content-Type: multipart/form-data

logo: <image file>
```

### Add package
```http
POST /api/packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Goa Beach Getaway",
  "description": "5 days in Goa with beach resorts",
  "price": "₹25,000",
  "duration": "5 Days / 4 Nights",
  "highlights": ["Beach access", "Water sports", "Sunset cruise"]
}
```

---

## Firestore Collections

| Collection | Document ID | Description |
|---|---|---|
| `pages` | `{userId}` | Agent's page config (branding, packages, countries, etc.) |
| `contact_inquiries` | auto-ID | Client inquiries submitted via contact form |

### `pages` document shape
```json
{
  "userId": "firebase-uid",
  "email": "agent@example.com",
  "branding": { "type": "text", "value": "My Travel Co" },
  "countries": ["india"],
  "packages": [ { "id": "uuid", "title": "...", "price": "..." } ],
  "showContactForm": true,
  "calendarYear": 2026,
  "slug": "",
  "published": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "publishedAt": "timestamp"
}
```

---

## Frontend Integration

In your React frontend, get the Firebase ID token and pass it to all protected routes:

```js
import { getAuth } from "firebase/auth";

const token = await getAuth().currentUser.getIdToken();

const res = await fetch("http://localhost:5000/api/pages/me", {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## Rate Limits

- General API: **200 requests / 15 minutes** per IP
- Contact form: **20 submissions / hour** per IP
