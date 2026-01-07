# ============================================================================
# PLANEXA - Google Cloud Deployment Script (PowerShell)
# Run this script to deploy Planexa to GCP
# ============================================================================

param(
    [string]$ProjectId = "",
    [string]$Region = "northamerica-northeast1",
    [string]$MongoDbUri = "",
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Status { param($msg) Write-Host "🔵 $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║              PLANEXA - Google Cloud Deployment                 ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# ============================================================================
# STEP 0: Configuration
# ============================================================================

if (-not $ProjectId) {
    $ProjectId = Read-Host "Enter your GCP Project ID"
}

if (-not $MongoDbUri) {
    Write-Warning "MongoDB URI not provided. You can add it later via Secret Manager."
    $MongoDbUri = "mongodb://placeholder"
}

$ServiceName = "planexa-backend"
$BucketName = "$ProjectId-planexa-frontend"
$ArtifactRepo = "planexa"
$GoogleApiKey = "AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM"

Write-Status "Configuration:"
Write-Host "  Project ID: $ProjectId"
Write-Host "  Region: $Region"
Write-Host "  Service: $ServiceName"
Write-Host "  Bucket: $BucketName"
Write-Host ""

# ============================================================================
# STEP 1: Authenticate and Configure
# ============================================================================

Write-Status "Step 1: Configuring Google Cloud..."

# Check if authenticated
$authAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $authAccount) {
    Write-Warning "Not authenticated. Opening browser for login..."
    gcloud auth login
}

# Set project
gcloud config set project $ProjectId
Write-Success "Project set to: $ProjectId"

# ============================================================================
# STEP 2: Enable Required APIs
# ============================================================================

Write-Status "Step 2: Enabling required APIs..."

$apis = @(
    "run.googleapis.com",
    "compute.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "  Enabling $api..."
    gcloud services enable $api --quiet 2>$null
}
Write-Success "APIs enabled"

# ============================================================================
# STEP 3: Create Artifact Registry
# ============================================================================

Write-Status "Step 3: Creating Artifact Registry..."

$repoExists = gcloud artifacts repositories describe $ArtifactRepo --location=$Region 2>$null
if (-not $repoExists) {
    gcloud artifacts repositories create $ArtifactRepo `
        --repository-format=docker `
        --location=$Region `
        --description="Planexa Docker images"
    Write-Success "Artifact Registry created"
} else {
    Write-Success "Artifact Registry already exists"
}

# Configure Docker auth
gcloud auth configure-docker "$Region-docker.pkg.dev" --quiet

# ============================================================================
# STEP 4: Create Secrets
# ============================================================================

Write-Status "Step 4: Setting up secrets..."

# Helper function to create secret
function Create-Secret {
    param($name, $value)
    
    $exists = gcloud secrets describe $name 2>$null
    if ($exists) {
        Write-Host "  Updating $name..."
        Write-Output $value | gcloud secrets versions add $name --data-file=-
    } else {
        Write-Host "  Creating $name..."
        Write-Output $value | gcloud secrets create $name --data-file=- --replication-policy="automatic"
    }
}

# Generate JWT secret
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Create-Secret "planexa-mongodb-uri" $MongoDbUri
Create-Secret "planexa-jwt-secret" $jwtSecret
Create-Secret "planexa-google-api-key" $GoogleApiKey

Write-Success "Secrets configured"

# ============================================================================
# STEP 5: Create Cloud Storage Bucket
# ============================================================================

Write-Status "Step 5: Creating Cloud Storage bucket..."

$bucketExists = gsutil ls "gs://$BucketName" 2>$null
if (-not $bucketExists) {
    gsutil mb -l $Region "gs://$BucketName"
    
    # Enable website hosting
    gsutil web set -m index.html -e index.html "gs://$BucketName"
    
    # Make bucket public
    gsutil iam ch allUsers:objectViewer "gs://$BucketName"
    
    Write-Success "Bucket created and configured"
} else {
    Write-Success "Bucket already exists"
}

# ============================================================================
# STEP 6: Build and Deploy Backend
# ============================================================================

if (-not $SkipBuild) {
    Write-Status "Step 6: Building backend Docker image..."
    
    Push-Location "backend"
    
    $imageName = "$Region-docker.pkg.dev/$ProjectId/$ArtifactRepo/backend:latest"
    
    Write-Host "  Building image..."
    docker build -t $imageName .
    
    Write-Host "  Pushing to Artifact Registry..."
    docker push $imageName
    
    Pop-Location
    
    Write-Success "Backend image pushed"
}

Write-Status "Step 7: Deploying to Cloud Run..."

gcloud run deploy $ServiceName `
    --image="$Region-docker.pkg.dev/$ProjectId/$ArtifactRepo/backend:latest" `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --set-secrets="MONGODB_URI=planexa-mongodb-uri:latest,JWT_SECRET=planexa-jwt-secret:latest,GOOGLE_API_KEY=planexa-google-api-key:latest" `
    --set-env-vars="NODE_ENV=production,PORT=3000" `
    --min-instances=0 `
    --max-instances=10 `
    --cpu=1 `
    --memory=512Mi

$backendUrl = gcloud run services describe $ServiceName --region=$Region --format="value(status.url)"
Write-Success "Backend deployed: $backendUrl"

# ============================================================================
# STEP 8: Build and Deploy Frontend
# ============================================================================

Write-Status "Step 8: Building frontend..."

Push-Location "frontend"

# Install dependencies
npm ci

# Build with API URL
$env:VITE_API_URL = "$backendUrl"
npm run build

Write-Status "Step 9: Uploading frontend to Cloud Storage..."

gsutil -m rsync -r -d dist "gs://$BucketName"

# Set cache headers
gsutil -m setmeta -h "Cache-Control:no-cache" "gs://$BucketName/index.html"
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" "gs://$BucketName/assets/*"

Pop-Location

Write-Success "Frontend deployed"

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    DEPLOYMENT COMPLETE!                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Backend URL:" -ForegroundColor Cyan
Write-Host "   $backendUrl" -ForegroundColor White
Write-Host ""

Write-Host "📦 Frontend URL:" -ForegroundColor Cyan
Write-Host "   https://storage.googleapis.com/$BucketName/index.html" -ForegroundColor White
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Update MongoDB URI in Secret Manager with real connection string"
Write-Host "   2. Set up custom domain (planexo.ca) with Load Balancer"
Write-Host "   3. Configure MongoDB Atlas VPC peering for production"
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "   View logs:    gcloud run logs read $ServiceName --region=$Region"
Write-Host "   Update secret: gcloud secrets versions add planexa-mongodb-uri --data-file=-"
Write-Host ""
