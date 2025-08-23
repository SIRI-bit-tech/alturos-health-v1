# Alturos Health - Healthcare Management System

A comprehensive healthcare management system built with Next.js frontend and Django backend, featuring real-time notifications, appointment management, and patient care coordination.

## 🚀 Features

- **User Management**: Patient and doctor profiles with role-based access
- **Appointment System**: Scheduling, confirmation, and video call integration
- **Real-time Notifications**: WebSocket-based notification system
- **Medical Records**: Comprehensive patient medical history and prescriptions
- **QR Code Integration**: Quick appointment check-in system
- **Responsive Design**: Mobile-first healthcare application

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS v4, shadcn/ui components
- **Backend**: Django 4.2 with Django REST Framework, JWT authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: Django Channels for WebSocket support
- **Authentication**: JWT-based secure authentication system

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.9+
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd alturos-health
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser for Django admin
python create_superuser.py

# Start Django server
python manage.py runserver
```

**Django Admin Access:**
- URL: http://127.0.0.1:8000/admin/
- Username: `admin`
- Password: `admin123`

### 3. Frontend Setup

```bash
# From the root directory
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

**Frontend Access:**
- URL: http://localhost:3000

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Django Backend
DJANGO_SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3

# Frontend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Database Configuration

The system uses SQLite by default for development. For production, update the database settings in `backend/alturos_health/settings.py`.

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Refresh JWT token

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PATCH /api/appointments/{id}/` - Update appointment

### Medical Records
- `GET /api/medical-records/` - List medical records
- `POST /api/medical-records/` - Create medical record
- `GET /api/medical-records/{id}/` - Get medical record

### Notifications
- `GET /api/notifications/` - List notifications
- `PATCH /api/notifications/{id}/mark-read/` - Mark as read
- `PATCH /api/notifications/mark-all-read/` - Mark all as read

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
npm run test
# or
pnpm test
```

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings
2. Configure production database
3. Set up static file serving
4. Use Gunicorn or uWSGI for production

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting
3. Configure environment variables

## 📁 Project Structure

```
alturos-health/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── doctor/            # Doctor-specific pages
│   └── ...                # Other page directories
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── maps/              # Map-related components
│   └── ...                # Other components
├── backend/                # Django backend
│   ├── accounts/          # User management app
│   ├── appointments/      # Appointment management
│   ├── medical_records/   # Medical records app
│   ├── notifications/     # Notification system
│   └── alturos_health/    # Main Django project
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- CORS configuration
- Input validation and sanitization
- Secure password handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a healthcare application. Ensure compliance with local healthcare regulations and data protection laws (HIPAA, GDPR, etc.) before deploying to production.
