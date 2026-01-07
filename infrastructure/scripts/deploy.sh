#!/bin/bash
# ============================================================================
# PLANEXA - Deployment Script
# Quick deploy to Google Cloud
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-northamerica-northeast1}"
SERVICE_NAME="planexa-backend"
BUCKET_NAME="${PROJECT_ID}-planexa-frontend"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PLANEXA DEPLOYMENT                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install${NC}"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Install Docker Desktop.${NC}"
        exit 1
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ GCP_PROJECT_ID not set. Run: export GCP_PROJECT_ID=your-project-id${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Authenticate and configure
setup_gcloud() {
    echo -e "\n${YELLOW}🔐 Configuring Google Cloud...${NC}"
    
    gcloud config set project "$PROJECT_ID"
    gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
    
    echo -e "${GREEN}✅ Google Cloud configured${NC}"
}

# Build and push backend
deploy_backend() {
    echo -e "\n${YELLOW}🐳 Building backend Docker image...${NC}"
    
    cd backend
    
    # Build image
    docker build -t "${REGION}-docker.pkg.dev/${PROJECT_ID}/planexa/backend:latest" .
    
    echo -e "${YELLOW}📤 Pushing to Artifact Registry...${NC}"
    docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/planexa/backend:latest"
    
    echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
    gcloud run deploy "$SERVICE_NAME" \
        --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/planexa/backend:latest" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --set-secrets="MONGODB_URI=planexa-mongodb-uri:latest,JWT_SECRET=planexa-jwt-secret:latest,GOOGLE_API_KEY=planexa-google-api-key:latest" \
        --set-env-vars="NODE_ENV=production,PORT=3000" \
        --min-instances=0 \
        --max-instances=10 \
        --cpu=1 \
        --memory=512Mi
    
    cd ..
    
    BACKEND_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
    echo -e "${GREEN}✅ Backend deployed: $BACKEND_URL${NC}"
}

# Build and deploy frontend
deploy_frontend() {
    echo -e "\n${YELLOW}🏗️  Building frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    npm ci
    
    # Build with production API URL
    VITE_API_URL="https://planexo.ca/api" npm run build
    
    echo -e "${YELLOW}📤 Uploading to Cloud Storage...${NC}"
    gsutil -m rsync -r -d dist "gs://${BUCKET_NAME}"
    
    # Set cache headers
    echo -e "${YELLOW}⚙️  Setting cache headers...${NC}"
    gsutil -m setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" "gs://${BUCKET_NAME}/**/*.html"
    gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" "gs://${BUCKET_NAME}/assets/**"
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend deployed to: https://storage.googleapis.com/${BUCKET_NAME}/index.html${NC}"
}

# Invalidate CDN cache
invalidate_cache() {
    echo -e "\n${YELLOW}🔄 Invalidating CDN cache...${NC}"
    
    gcloud compute url-maps invalidate-cdn-cache planexa-url-map --path="/*" --async || true
    
    echo -e "${GREEN}✅ CDN cache invalidation requested${NC}"
}

# Print summary
print_summary() {
    BACKEND_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)' 2>/dev/null || echo "N/A")
    LB_IP=$(gcloud compute addresses describe planexa-global-ip --global --format='value(address)' 2>/dev/null || echo "N/A")
    
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    DEPLOYMENT COMPLETE                         ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 Load Balancer IP: ${LB_IP}${NC}"
    echo -e "${GREEN}🔧 Backend URL: ${BACKEND_URL}${NC}"
    echo -e "${GREEN}📦 Frontend Bucket: gs://${BUCKET_NAME}${NC}"
    echo ""
    echo -e "${YELLOW}📋 DNS Configuration:${NC}"
    echo -e "   planexo.ca     A  ${LB_IP}"
    echo -e "   www.planexo.ca A  ${LB_IP}"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    setup_gcloud
    
    case "${1:-all}" in
        backend)
            deploy_backend
            ;;
        frontend)
            deploy_frontend
            invalidate_cache
            ;;
        all)
            deploy_backend
            deploy_frontend
            invalidate_cache
            ;;
        *)
            echo -e "${RED}Usage: $0 [backend|frontend|all]${NC}"
            exit 1
            ;;
    esac
    
    print_summary
}

main "$@"
