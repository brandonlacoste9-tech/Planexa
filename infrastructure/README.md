# 🚀 Planexa Infrastructure

Production-ready Google Cloud deployment for Planexa — serverless MERN stack.

## 📐 Architecture

```
                                    ┌─────────────────────┐
                                    │   Global Load       │
                                    │   Balancer          │
                                    │   (planexo.ca)      │
                                    └─────────┬───────────┘
                                              │
                          ┌───────────────────┴───────────────────┐
                          │                                       │
                          ▼                                       ▼
              ┌───────────────────┐                 ┌─────────────────────┐
              │  Cloud Storage    │                 │    Cloud Run        │
              │  (Static Assets)  │                 │    (Backend API)    │
              │                   │                 │                     │
              │  - React App      │                 │  - Node.js/Express  │
              │  - CDN enabled    │                 │  - Mongoose/MongoDB │
              │  - Gzip/Brotli    │                 │  - Auto-scaling     │
              └───────────────────┘                 └──────────┬──────────┘
                                                              │
                                                              │ VPC Peering
                                                              │
                                                   ┌──────────▼──────────┐
                                                   │   MongoDB Atlas     │
                                                   │   (Montreal)        │
                                                   │                     │
                                                   │   - M10+ cluster    │
                                                   │   - Auto-backup     │
                                                   └─────────────────────┘
```

## 🏗️ Components

| Component | Service | Purpose |
|-----------|---------|---------|
| **Frontend** | Cloud Storage + CDN | Static React app |
| **Backend** | Cloud Run | Node.js/Express API |
| **Database** | MongoDB Atlas | Document database |
| **Secrets** | Secret Manager | API keys, credentials |
| **Network** | VPC + Peering | Secure DB connection |
| **SSL** | Managed Certificate | HTTPS for planexo.ca |
| **Load Balancer** | Global HTTP(S) LB | Traffic routing |

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **MongoDB Atlas Account** with M10+ cluster
3. **gcloud CLI** installed and authenticated
4. **Terraform** >= 1.0 installed
5. **Docker** for local builds

## 🚀 Quick Start

### Step 1: Set Environment Variables

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="northamerica-northeast1"
```

### Step 2: Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  vpcaccess.googleapis.com
```

### Step 3: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster in **Montreal (northamerica-northeast1)**
3. Choose **M10** or higher for VPC peering support
4. Get your connection string

### Step 4: Set Up Secrets

```bash
chmod +x infrastructure/scripts/setup-secrets.sh
./infrastructure/scripts/setup-secrets.sh
```

### Step 5: Deploy with Terraform

```bash
cd infrastructure/terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize and apply
terraform init
terraform plan
terraform apply
```

### Step 6: Configure DNS

Point your domain to the load balancer IP:

```
planexo.ca     A  <LOAD_BALANCER_IP>
www.planexo.ca A  <LOAD_BALANCER_IP>
```

### Step 7: Deploy Application

```bash
chmod +x infrastructure/scripts/deploy.sh
./infrastructure/scripts/deploy.sh all
```

## 📁 File Structure

```
infrastructure/
├── terraform/
│   ├── main.tf                 # Main Terraform config
│   └── terraform.tfvars.example # Variable template
├── cloudbuild/
│   └── cloudbuild.yaml         # CI/CD pipeline
├── scripts/
│   ├── deploy.sh               # Manual deployment
│   └── setup-secrets.sh        # Secret configuration
└── README.md                   # This file
```

## 🔧 Configuration

### Terraform Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `project_id` | GCP Project ID | Required |
| `region` | Primary region | `northamerica-northeast1` |
| `domain` | Custom domain | `planexo.ca` |
| `mongodb_connection_string` | Atlas URI | Required |
| `jwt_secret` | JWT signing key | Required |
| `google_api_key` | Gemini API key | Provided |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `TWILIO_ACCOUNT_SID` | Twilio account |
| `TWILIO_AUTH_TOKEN` | Twilio auth |
| `NODE_ENV` | `production` |

## 🔒 Security

### Secrets Management

All sensitive values stored in Secret Manager:
- `planexa-mongodb-uri`
- `planexa-jwt-secret`
- `planexa-google-api-key`
- `planexa-twilio-account-sid`
- `planexa-twilio-auth-token`

### Network Security

- VPC peering for MongoDB Atlas
- Cloud Run with VPC connector
- Private IP access only to database
- SSL/TLS encryption everywhere

### Access Control

- Cloud Run service account with minimal permissions
- Secret accessor role only for required secrets
- Uniform bucket-level access for frontend

## 📊 Scaling

### Cloud Run (Backend)

```yaml
min_instances: 0      # Scale to zero
max_instances: 10     # Auto-scale up
cpu: 1                # 1 vCPU
memory: 512Mi         # 512MB RAM
```

### MongoDB Atlas

- Start with M10 (shared)
- Upgrade to M30+ for production
- Enable auto-scaling

## 💰 Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Cloud Run | ~$5-50 (usage-based) |
| Cloud Storage | ~$1-5 |
| Load Balancer | ~$18 |
| MongoDB Atlas M10 | ~$57 |
| **Total** | **~$80-130/month** |

*Costs vary based on usage*

## 🔄 CI/CD Pipeline

Automated deployment via Cloud Build:

1. **Trigger**: Push to `main` branch
2. **Build**: Docker image for backend
3. **Push**: Image to Artifact Registry
4. **Deploy**: Backend to Cloud Run
5. **Build**: Frontend with Vite
6. **Upload**: Static files to Cloud Storage
7. **Invalidate**: CDN cache

### Set Up Cloud Build Trigger

```bash
gcloud builds triggers create github \
  --repo-name="Planexa" \
  --repo-owner="brandonlacoste9-tech" \
  --branch-pattern="^main$" \
  --build-config="infrastructure/cloudbuild/cloudbuild.yaml"
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
gcloud run services logs read planexa-backend --region=northamerica-northeast1

# Check secrets
gcloud secrets versions access latest --secret=planexa-mongodb-uri
```

### Can't connect to MongoDB

1. Check VPC peering status in MongoDB Atlas
2. Verify IP whitelist includes GCP ranges
3. Test connection from Cloud Shell

### SSL certificate pending

- DNS must propagate first (up to 48 hours)
- Check certificate status:
  ```bash
  gcloud compute ssl-certificates describe planexa-ssl-cert
  ```

## 📚 Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [MongoDB Atlas on GCP](https://www.mongodb.com/cloud/atlas/gcp)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

---

**Questions?** Open an issue or contact the team.
