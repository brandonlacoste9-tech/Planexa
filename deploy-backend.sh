#!/bin/bash

set -e

# Configuration
PROJECT_ID="unique-spirit-482300-s4"
REGION="northamerica-northeast1"
SERVICE_NAME="planexa-api"
DB_INSTANCE="planexa-db"

echo "Deploying Planexa Backend to Cloud Run ($REGION)..."

# Build and Submit Container
gcloud builds submit backend-python --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project $PROJECT_ID

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --project $PROJECT_ID \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-cloudsql-instances $PROJECT_ID:$REGION:$DB_INSTANCE \
  --set-env-vars "DATABASE_URL=postgresql://postgres:PlanexaQuebec2026!@/planexa?host=/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE"

echo "Deployment complete!"
