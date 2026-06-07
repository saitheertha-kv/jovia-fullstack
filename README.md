# Jovia Platform

A full-stack influencer marketing and e-commerce platform connecting brands, influencers, and users. Built with React (Vite) frontend and Django backend, it enables brand-influencer collaborations, product management, event promotions, and user engagement.

---

## 1. Project Overview

**Jovia** solves the challenge of managing collaborations between brands and influencers, product promotions, and user engagement in a unified platform.

### Key Features

- Multi-role system: Admin, Brand, Influencer, User, Guest
- Brand and influencer registration, verification, and profile management
- Product catalog, stock, and booking management
- Event creation, application, and management
- Chat and request system between brands and influencers
- User shopping cart, booking, and complaint management
- Modular, scalable architecture

---

## 2. Architecture & Module Analysis

### Architecture Pattern

- **Backend:** Django (MVC pattern)
- **Frontend:** React (Component-based SPA, Vite)
- **API:** RESTful endpoints (JSON)

### Module Breakdown

#### Backend (`Server/server/`)
- **models.py:** All database models (users, brands, influencers, products, bookings, chat, etc.)
- **views.py:** API endpoints for CRUD operations, authentication, business logic
- **urls.py:** URL routing for all API endpoints
- **settings.py:** Django project settings, database config, CORS, middleware

#### Frontend (`Client/src/`)
- **Router/**: Centralized route management for each user role
- **context/ThemeContext.jsx:** Theme provider for consistent UI
- **Admin, Brand, Influencer, User, Guest:** Each folder contains layouts, components, and pages for the respective user role
- **public/css/global.css:** Global styles

### Data & Control Flow

- **Frontend** interacts with backend via REST API (Axios)
- **Role-based routers** load layouts and pages based on user type
- **Backend** handles authentication, data validation, and business logic
- **Database** (SQLite) stores all persistent data

---

## 3. File Structure Explanation

```
Jovia/
├── Client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── css/global.css
│   └── src/
│       ├── main.jsx
│       ├── context/ThemeContext.jsx
│       ├── Router/
│       │   ├── MainRouter.jsx
│       │   ├── AdminRouter.jsx
│       │   ├── BrandRouter.jsx
│       │   ├── InfluencerRouter.jsx
│       │   ├── UserRouter.jsx
│       │   ├── GuestRouter.jsx
│       │   └── BasicRouter.jsx
│       ├── Admin/Brand/Influencer/User/Guest/
│       │   └── Layouts, Components, Pages
├── Server/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── server/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── settings.py
│   │   └── migrations/
│   ├── Assets/
│   │   ├── brand/photo, proof
│   │   ├── influencer/photo
│   │   └── user/photo
│   ├── post/files/
│   └── product/images/
```

**Entry Points:**
- Frontend: `Client/src/main.jsx`
- Backend: `Server/manage.py` (Django)

---

## 4. Tech Stack

- **Frontend:** React 19, Vite 7, MUI, Emotion, Framer Motion, Axios, React Router
- **Backend:** Django 5.2, Django REST, SQLite3
- **Styling:** CSS Modules, MUI, custom global CSS
- **Dev Tools:** ESLint, Vite, Python 3.10
- **Other:** CORS, file uploads

---

## 5. Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- pip

### Backend Setup

```bash
cd Server
python -m venv venv
venv\Scripts\activate  # On Windows
pip install django==5.2
pip install django-cors-headers
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd Client
npm install
npm run dev
```

### Environment Variables

- **Backend:** Set `SECRET_KEY` in `server/settings.py` for production
- **Frontend:** None required by default

---

## 6. Running the Project

### Development

- **Backend:** `python manage.py runserver` (default: http://127.0.0.1:8000)
- **Frontend:** `npm run dev` (default: http://localhost:5173)

### Production

- **Backend:** Use `gunicorn` or `uwsgi` for deployment
- **Frontend:** `npm run build` then serve `dist/` with a static server

### Background Services

- No additional services required (uses SQLite and local file storage)

---

## 7. API Documentation

### Major Endpoints (examples)

| Endpoint                        | Method | Description                        |
|----------------------------------|--------|------------------------------------|
| `/District/`                    | GET/POST | List or create districts           |
| `/Category/`                    | GET/POST | List or create categories          |
| `/BrandReg/`                    | POST   | Register a new brand               |
| `/Userreg/`                     | POST   | Register a new user                |
| `/InfluencerReg/`               | POST   | Register a new influencer          |
| `/Product/`                     | GET/POST | List or create products            |
| `/Booking/`                     | GET/POST | List or create bookings            |
| `/ChatRoom/`                    | GET/POST | Chat between brand & influencer    |
| `/Complaint/`                   | GET/POST | User complaints                    |

- **Request/Response:** JSON
- **Authentication:** Session-based (no JWT/OAuth by default)
- **File Uploads:** Multipart/form-data for images/files

---

## 8. Usage Guide

### User Flow

- **Guest:** Register as User, Brand, or Influencer
- **User:** Browse products, add to cart, book, post complaints
- **Brand:** Register, add products, create events, chat with influencers, send requests
- **Influencer:** Register, manage profile, apply to events, post content, chat with brands
- **Admin:** Manage categories, districts, verify brands/influencers, handle complaints

### Screens/Features

- Role-based dashboards and navigation
- Profile management for all roles
- Product and event management (Brand)
- Booking and cart (User)
- Chat and requests (Brand/Influencer)
- Complaint system (User/Admin)

---

## 9. Known Issues / Limitations

- **Scalability:** Uses SQLite; not suitable for high-load production
- **Security:** Passwords stored in plaintext (should use hashing)
- **Authentication:** No JWT/OAuth; session-based only
- **File Storage:** Local filesystem, not cloud storage
- **Testing:** No automated tests provided
- **Error Handling:** Minimal validation and error reporting

---

## 10. Improvements / Future Scope

- Migrate to PostgreSQL or MySQL for production
- Implement password hashing and authentication best practices
- Add JWT or OAuth2 authentication
- Integrate cloud storage for media files (AWS S3, GCP)
- Add automated tests (unit, integration)
- Implement role-based access control (RBAC) on backend
- Add real-time chat (WebSockets)
- Improve API documentation (Swagger/OpenAPI)
- Add CI/CD pipeline

---

## 11. Contribution Guidelines

- Fork the repository
- Create a feature branch
- Commit changes with clear messages
- Submit a pull request for review

---

## 12. License

**Suggested:** MIT License (permissive, suitable for most open-source projects)

---
