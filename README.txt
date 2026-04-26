# Nook (PFP-CP2)

A comprehensive full-stack web application for property rentals and reservations. This platform enables users to list houses, browse available properties, and manage accommodation bookings seamlessly.

## Description

Nook is designed to solve the problem of finding and managing property rentals. The application provides a robust API and a dynamic, responsive user interface. Key objectives include secure user authentication, property listing management, advanced search capabilities, and a streamlined reservation workflow.

**Main Features:**
*   **User Authentication:** Secure signup and login using JWT.
*   **Property Management:** Add, edit, and view house details.
*   **Posts & Listings:** Browse properties available for rent.
*   **Reservations:** Book properties and manage reservation statuses.
*   **Search & Filtering:** Find properties based on specific criteria.
*   **Interactive Maps:** View property locations using Leaflet maps.

## Tech Stack

### Frontend
*   **Framework:** Next.js (React 19)
*   **Styling:** Emotion, Material-UI (MUI), Flowbite React
*   **Forms & Validation:** React Hook Form, Zod
*   **Maps:** Leaflet, React-Leaflet
*   **Other Tools:** Framer Motion (animations), Axios/Fetch for API communication

### Backend
*   **Framework:** Django (Python)
*   **API Layer:** Django Ninja
*   **Authentication:** Django Ninja JWT
*   **Database:** PostgreSQL (via psycopg2)
*   **Caching:** Redis (django-redis)
*   **File Storage:** S3-compatible storage via Boto3 (django-storages)

## Architecture Overview

The project follows a decoupled architecture where the Next.js frontend communicates with the Django backend via a RESTful API built with Django Ninja.
*   **Communication:** JSON over HTTP.
*   **Authentication:** The backend issues JSON Web Tokens (JWT) upon successful login. The frontend stores these tokens and attaches them to the Authorization header for protected endpoints.
*   **Static/Media Files:** Handled remotely via an S3 bucket (Supabase Storage).

## Project Structure

PFP-CP2/
├── backEnd/                 # Django backend application
│   ├── Accounts/            # User account management and authentication
│   ├── config/              # Django settings, ASGI/WSGI, and API routing
│   ├── Houses/              # Property and house models/endpoints
│   ├── mynook/              # Core application logic
│   ├── Posts/               # Property listings/posts endpoints
│   ├── Reservations/        # Booking and reservation logic
│   ├── utilitymethods/      # Helper functions and utilities
│   ├── wilayas/             # Location/Region data management
│   ├── manage.py            # Django management script
│   └── requirements.txt     # Python dependencies
└── frontEnd/
    └── pfp_front/           # Next.js frontend application
        ├── app/             # Next.js App Router pages and layouts
        ├── components/      # Reusable React components
        ├── data/            # Mock data or static datasets
        ├── lib/             # Utility functions and API clients
        ├── public/          # Static assets (images, icons)
        ├── styles/          # Global styles
        ├── types/           # TypeScript definitions
        └── package.json     # Node.js dependencies

## Prerequisites

Ensure you have the following installed on your local machine:
*   **Node.js** (v18 or higher recommended)
*   **npm** or **yarn**
*   **Python** (v3.10 or higher)
*   **Redis** (Optional, but recommended for local caching)

## Installation Instructions

### Backend Setup

1.  **Navigate to the backend directory:**
    cd backEnd

2.  **Create and activate a virtual environment:**
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

3.  **Install Python dependencies:**
    pip install -r requirements.txt

4.  **Run database migrations:**
    (Ensure your database credentials are correct before running this)
    python manage.py migrate

### Frontend Setup

1.  **Navigate to the frontend directory:**
    cd frontEnd/pfp_front

2.  **Install Node.js dependencies:**
    npm install

## Environment Variables

While some credentials may currently be present in the configuration files, it is highly recommended to extract them into .env files.

**Backend (backEnd/.env example):**
DEBUG=True
SECRET_KEY=your-django-secret-key
DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://127.0.0.1:6379/1
AWS_ACCESS_KEY_ID=your-s3-access-key
AWS_SECRET_ACCESS_KEY=your-s3-secret-key

**Frontend (frontEnd/pfp_front/.env.local example):**
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

## Running the Project

**1. Start the Backend Server:**
Open a terminal, activate your virtual environment, and run:
cd backEnd
python manage.py runserver

The API will be available at http://127.0.0.1:8000/.

**2. Start the Frontend Development Server:**
Open a new terminal and run:
cd frontEnd/pfp_front
npm run dev

The frontend application will be accessible at http://localhost:3000/.

## API Documentation

The backend utilizes **Django Ninja**, which automatically generates interactive API documentation. Once the backend server is running, you can access the Swagger UI/OpenAPI docs typically at:
http://127.0.0.1:8000/api/docs

**Core Endpoints:**
*   POST /api/token/ - Obtain JWT pair (Login).
*   POST /api/token/verify/ - Verify an existing token.
*   GET/POST /api/Account/ - Manage user accounts.
*   GET/POST /api/Houses/ - Manage house properties.
*   GET/POST /api/Posts/ - Retrieve or create property listings.
*   GET/POST /api/Reservations/ - Create or view reservations.
*   GET /api/Search/ - Search for available properties based on parameters.

## Database

The project is configured to use a **PostgreSQL** database (currently configured to point to a Supabase instance).
Redis is utilized as a caching layer to improve response times for frequent queries. Migrations are managed natively via Django (makemigrations and migrate).

## Features

*   **User-facing Features:**
    *   Browse property listings and view high-quality images.
    *   View exact locations on an interactive map.
    *   Filter properties by location, price, and dates.
    *   Securely book properties and view past/upcoming reservations.
*   **Admin/Host Features:**
    *   Create and manage property listings (Houses and Posts).
    *   Upload property media (stored directly to S3).
    *   Approve or reject reservations.

## Usage Guide

1.  **Accessing the App:** Navigate to http://localhost:3000 in your web browser.
2.  **Authentication:** Click on the Login/Register button. Create a new account or log in with existing credentials to receive a session token.
3.  **Browsing:** Use the home page or search bar to look for accommodations. Click on a listing to view detailed information and map coordinates.
4.  **Booking:** On a property details page, select your desired dates and confirm the reservation.

## Known Issues / Limitations

*   **Hardcoded Credentials:** Sensitive credentials (like database passwords, S3 keys, and email passwords) are currently hardcoded in settings.py. These should be migrated to environment variables for security.
*   **CORS Configuration:** Ensure CORS_ALLOWED_ORIGINS in the backend settings matches the actual frontend URL in production.

## Future Improvements

*   **Security:** Migrate all sensitive data (Secret Key, DB URLs, API keys) to .env files using python-dotenv.
*   **Testing:** Implement automated testing using pytest for the backend and Jest or Cypress for the frontend to ensure stability.
*   **Containerization:** Add Docker and docker-compose.yml to streamline the setup process for new developers and simplify deployment.

## Contributing

1. Fork the repository.
2. Create a new branch (git checkout -b feature/amazing-feature).
3. Commit your changes (git commit -m 'Add some amazing feature').
4. Push to the branch (git push origin feature/amazing-feature).
5. Open a Pull Request.


## Authors

*   **PFP-CP2 Team** -
    -Namane Haithem
    -Akli Merouane
    -Bennacer Sami Fares
    -Tetbirt Abdellah
    -Baroudi Laid
    -Djabed Alae dine
    -Messikh Yahia
