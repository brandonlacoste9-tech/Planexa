# ============================================================================
# PLANEXO DEPLOYMENT - Exact Commands for planexa-demo-v5
# Copy and paste these commands into PowerShell one section at a time
# ============================================================================

# ============================================================================
# STEP 1: Set Project
# ============================================================================

gcloud config set project planexa-demo-v5

# ============================================================================
# STEP 2: Enable Required APIs
# ============================================================================

gcloud services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    artifactregistry.googleapis.com `
    secretmanager.googleapis.com `
    storage.googleapis.com

# ============================================================================
# STEP 3: Create Artifact Registry (Montreal)
# ============================================================================

gcloud artifacts repositories create planexo `
    --repository-format=docker `
    --location=northamerica-northeast1 `
    --description="Planexo Docker images"

# Configure Docker authentication
gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev --quiet

# ============================================================================
# STEP 4: Create Secrets in Secret Manager
# ============================================================================

# JWT Secret (auto-generated secure key)
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "Generated JWT Secret: $jwtSecret"
$jwtSecret | gcloud secrets create planexo-jwt-secret --data-file=- --replication-policy="automatic"

# Google API Key (your verified key)
"AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM" | gcloud secrets create planexo-google-api-key --data-file=- --replication-policy="automatic"

# MongoDB URI placeholder (you'll update this manually)
"mongodb://placeholder-update-in-console" | gcloud secrets create planexo-mongodb-uri --data-file=- --replication-policy="automatic"

# ============================================================================
# STEP 5: Build Backend Docker Image
# ============================================================================

# Navigate to Planexa directory
cd C:\Users\north\ZyeuteV5\Planexa\backend

# Build with Cloud Build (no local Docker needed)
gcloud builds submit --tag northamerica-northeast1-docker.pkg.dev/planexa-demo-v5/planexo/backend:latest

# ============================================================================
# STEP 6: Deploy Backend to Cloud Run
# ============================================================================

gcloud run deploy planexo-backend `
    --image=northamerica-northeast1-docker.pkg.dev/planexa-demo-v5/planexo/backend:latest `
    --region=northamerica-northeast1 `
    --platform=managed `
    --allow-unauthenticated `
    --set-secrets="MONGODB_URI=planexo-mongodb-uri:latest,JWT_SECRET=planexo-jwt-secret:latest,GOOGLE_API_KEY=planexo-google-api-key:latest" `
    --set-env-vars="NODE_ENV=production,PORT=3000" `
    --min-instances=0 `
    --max-instances=10 `
    --cpu=1 `
    --memory=512Mi

# Get the deployed URL
$BACKEND_URL = gcloud run services describe planexo-backend --region=northamerica-northeast1 --format="value(status.url)"
Write-Host "✅ Backend URL: $BACKEND_URL"

# ============================================================================
# STEP 7: Create Frontend Storage Bucket
# ============================================================================

# Create bucket
gsutil mb -l northamerica-northeast1 gs://planexo-demo-v5-frontend

# Configure as website
gsutil web set -m index.html -e index.html gs://planexo-demo-v5-frontend

# Make public
gsutil iam ch allUsers:objectViewer gs://planexo-demo-v5-frontend

# Enable CORS
@"
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
"@ | Out-File -Encoding UTF8 cors.json
gsutil cors set cors.json gs://planexo-demo-v5-frontend
Remove-Item cors.json

# ============================================================================
# STEP 8: Build and Deploy Frontend
# ============================================================================

cd C:\Users\north\ZyeuteV5\Planexa\frontend

# Install dependencies
npm ci

# Build with backend URL
$env:VITE_API_URL = $BACKEND_URL
npm run build

# Upload to Cloud Storage
gsutil -m rsync -r -d dist gs://planexo-demo-v5-frontend

# Set cache headers
gsutil -m setmeta -h "Cache-Control:no-cache, no-store" gs://planexo-demo-v5-frontend/index.html
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" gs://planexo-demo-v5-frontend/assets/*

# ============================================================================
# DONE! 🎉
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    DEPLOYMENT COMPLETE!                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Backend API:" -ForegroundColor Cyan
Write-Host "   $BACKEND_URL" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Frontend:" -ForegroundColor Cyan
Write-Host "   https://storage.googleapis.com/planexo-demo-v5-frontend/index.html" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next: Update MongoDB URI in Secret Manager or Cloud Run console" -ForegroundColor Yellow
