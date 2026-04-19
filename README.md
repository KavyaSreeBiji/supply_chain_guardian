# Supply Chain Guardian

Supply Chain Guardian is an intelligent, full-stack supply chain management system designed to provide real-time inventory awareness and deep logistics insights. The application marries a powerful Python/Django backend with a modern, decoupled React frontend powered by Vite, emphasizing premium visual fidelity and multi-agent AI analysis.

## Features

- **Component-Based React Frontend**: Features a modern, sleek user interface with state-of-the-art 3D perspective aesthetics, micro-animations, and dynamic motion effects.
- **Robust Django Backend**: A scalable backend infrastructure exposing comprehensive endpoints for Inventory Items, Shipments, and Market Trends.
- **Real-Time Logistics Dashboard**: Consolidates inventory stock levels, active shipments tracking, ETA statuses, and predictive market risks into one seamless view.
- **AI-Powered Guardian Chat**: Integrates with the Gemini API to offer an intelligent, domain-specific assistant capable of sophisticated supply chain troubleshooting and predictive analysis.

## Tech Stack

**Frontend Architecture**
- React 19
- Vite
- Framer Motion (dynamic animations)
- Vanilla CSS (custom design system)

**Backend Architecture**
- Python / Django 
- SQLite3 Database
- django-cors-headers

## Project Structure

- `frontend/` - Contains the Vite/React SPA, localized components, hooks, and static assets.
- `guardian/` - The core Django app representing the application's models, logic, and API endpoints. 
- `supply_chain/` - The main Django project configuration directory (settings, root URLs, WSGI/ASGI).
- `seed.py` - Development script for quickly bootstrapping the SQLite database with mock logistics data.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [Python](https://www.python.org/downloads/) (v3.10+)

### Setting up the Backend

1. Navigate to the root directory and create the virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment (Windows):
   ```bash
   .\venv\Scripts\activate
   ```
3. Ensure Django and its dependencies are installed:
   ```bash
   pip install django django-cors-headers google-generativeai python-dotenv
   ```
4. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. *(Optional)* Seed the database with sample data:
   ```bash
   python seed.py
   ```
6. Configure API keys: Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
7. Start the backend server:
   ```bash
   python manage.py runserver
   ```
   *The backend will be served at `http://127.0.0.1:8000/`*

### Setting up the Frontend

1. Navigate to the frontend workspace:
   ```bash
   cd frontend
   ```
2. Install the JavaScript package dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite development server:
   ```bash
   npm run dev
   ```
   *The application UI will be available at `http://localhost:5173/`*

### One-Click Execution
If the environment is completely set up, you may also run the root-level script to boot the backend:
```bash
.\run.bat
```

## AI Configuration
The Intelligent Guardian Chat requires an active Gemini account. If you do not have an API key configured in `.env`, the chat may surface simulated fallback responses or report connection errors. 

## License
MIT License.
