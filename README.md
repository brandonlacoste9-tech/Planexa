# Planexa ⚜️

Plateforme de planification fièrement québécoise.

## Architecture

- **Backend**: Python (FastAPI)
- **Frontend**: React / Vite / Tailwind
- **Database**: PostgreSQL (Google Cloud SQL)
- **Deployment**: Google Cloud Run

## Configuration

The application authenticates with Google Cloud using the active `gcloud` credentials.

### Development

The project uses a hybrid structure for Python and Node.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Backend:**

```bash
cd backend-python
pip install -r requirements.txt
python main.py
```

### Database

The database is hosted on Google Cloud SQL (Montréal).
Instance: `planexa-db`
Region: `northamerica-northeast1`
