# 🚀 Deploy Planexa to Google Cloud - Quick Start

Run these commands in **PowerShell** or **Windows Terminal**.

## Step 1: Authenticate (One-time)

```powershell
# Login to Google Cloud
gcloud auth login

# Set your project (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID
```

## Step 2: Run Deployment Script

```powershell
cd C:\Users\north\ZyeuteV5\Planexa

# Run the deployment (replace YOUR_PROJECT_ID)
.\deploy-to-gcp.ps1 -ProjectId "YOUR_PROJECT_ID"
```

## OR: Step-by-Step Manual Commands

If the script doesn't work, run these commands one by one:

### 1. Set Variables
```powershell
$PROJECT_ID = "YOUR_PROJECT_ID"
$REGION = "northamerica-northeast1"
```

### 2. Enable APIs
```powershell
gcloud services enable run.googleapis.com storage.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com
```

### 3. Create Artifact Registry
```powershell
gcloud artifacts repositories create planexa --repository-format=docker --location=$REGION
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet
```

### 4. Create Secrets
```powershell
# JWT Secret
"your-super-secret-jwt-key-32chars" | gcloud secrets create planexa-jwt-secret --data-file=-

# Google API Key
"AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM" | gcloud secrets create planexa-google-api-key --data-file=-

# MongoDB URI (add your real URI later)
"mongodb://placeholder" | gcloud secrets create planexa-mongodb-uri --data-file=-
```

### 5. Build & Push Backend
```powershell
cd backend
docker build -t "$REGION-docker.pkg.dev/$PROJECT_ID/planexa/backend:latest" .
docker push "$REGION-docker.pkg.dev/$PROJECT_ID/planexa/backend:latest"
cd ..
```

### 6. Deploy to Cloud Run
```powershell
gcloud run deploy planexa-backend `
    --image="$REGION-docker.pkg.dev/$PROJECT_ID/planexa/backend:latest" `
    --region=$REGION `
    --platform=managed `
    --allow-unauthenticated `
    --set-secrets="MONGODB_URI=planexa-mongodb-uri:latest,JWT_SECRET=planexa-jwt-secret:latest,GOOGLE_API_KEY=planexa-google-api-key:latest" `
    --set-env-vars="NODE_ENV=production,PORT=3000"
```

### 7. Create Storage Bucket
```powershell
gsutil mb -l $REGION "gs://$PROJECT_ID-planexa-frontend"
gsutil web set -m index.html -e index.html "gs://$PROJECT_ID-planexa-frontend"
gsutil iam ch allUsers:objectViewer "gs://$PROJECT_ID-planexa-frontend"
```

### 8. Build & Deploy Frontend
```powershell
cd frontend
npm ci
npm run build
gsutil -m rsync -r -d dist "gs://$PROJECT_ID-planexa-frontend"
cd ..
```

## ✅ Done!

Your app will be available at:

- **Backend**: `https://planexa-backend-XXXXX-nn.a.run.app`
- **Frontend**: `https://storage.googleapis.com/YOUR_PROJECT_ID-planexa-frontend/index.html`

## 📋 After Deployment

1. **Get your MongoDB Atlas connection string** and update the secret:
   ```powershell
   "mongodb+srv://user:pass@cluster.mongodb.net/planexa" | gcloud secrets versions add planexa-mongodb-uri --data-file=-
   ```

2. **Set up custom domain** (planexo.ca) via Cloud Console

3. **View logs**:
   ```powershell
   gcloud run logs read planexa-backend --region=northamerica-northeast1
   ```

---

**Need help?** Open the Google Cloud Console: https://console.cloud.google.com
