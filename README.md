# NIF Leave Management System

A comprehensive leave management and memo approval system built with Django REST Framework (backend) and React + Vite (frontend). Supports role-based access for makers, checkers, and approvers.

## Features

- **Role-Based Access Control**: Separate interfaces for makers (apply for leave), checkers (review requests), and approvers (approve/reject).
- **Leave Management**: Apply, track, and manage leave requests with calendar view.
- **Memo Approval Workflow**: Create, submit, check, and approve memos.
- **User Registration**: Self-registration with automatic maker role assignment.
- **Responsive Design**: Modern, professional UI that works on all devices.
- **JWT Authentication**: Secure token-based authentication.

## Tech Stack

- **Backend**: Django 4.x, Django REST Framework, Simple JWT, SQLite
- **Frontend**: React 18, Vite, Axios, React Router
- **Styling**: Custom CSS with CSS Variables
- **Deployment**: Ready for production with static file serving

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Project Structure

```
leave-system/
├── backend/                 # Django backend
│   ├── config/             # Django settings
│   ├── users/              # User management app
│   ├── leaves/             # Leave management app
│   ├── memos/              # Memo approval app
│   ├── db.sqlite3          # SQLite database
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom React hooks
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
└── README.md              # This file
```

## Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (proxied to backend API)

## Running the Full Application

1. **Start backend** (in one terminal):
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Start frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000/api/v1/`
   - Admin panel: `http://localhost:8000/admin/`

## User Roles

- **Maker**: Can apply for leave and create memos
- **Checker**: Can review pending leave requests and check memos
- **Approver**: Can approve/reject leave requests and approve memos
- **Admin**: Full access to all features

## API Endpoints

### Authentication
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/register/` - User registration
- `GET /api/v1/auth/user/` - Get current user info

### Leaves
- `GET /api/v1/leaves/` - List leaves (filtered by role)
- `POST /api/v1/leaves/` - Create leave request
- `POST /api/v1/leaves/{id}/set_status/` - Update leave status
- `GET /api/v1/leaves/balance` - Get leave balances
- `GET /api/v1/leaves/calendar` - Get approved leaves for calendar

### Memos
- `GET /api/v1/memos/` - List memos (filtered by role)
- `POST /api/v1/memos/` - Create memo
- `PATCH /api/v1/memos/{id}/` - Update memo status

## Development

### Backend
- Run tests: `python manage.py test`
- Check code: `python manage.py check`
- Create migrations: `python manage.py makemigrations`

### Frontend
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`

## Deployment

### Backend
1. Set `DEBUG = False` in `config/settings.py`
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Use production WSGI server (gunicorn)

### Frontend
1. Build the app: `npm run build`
2. Serve the `dist/` folder with any static server
3. Configure API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository.