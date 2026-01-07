#!/bin/bash
# ============================================================================
# PLANEXA - Secret Manager Setup Script
# Creates secrets in Google Cloud Secret Manager
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID="${GCP_PROJECT_ID:-}"

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ GCP_PROJECT_ID not set${NC}"
    exit 1
fi

echo -e "${YELLOW}🔐 Setting up secrets for project: $PROJECT_ID${NC}\n"

# Function to create or update secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    echo -e "${YELLOW}Creating secret: $secret_name${NC}"
    
    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "   Secret exists, adding new version..."
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        echo "   Creating new secret..."
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID" --replication-policy="automatic"
    fi
    
    echo -e "${GREEN}   ✅ $secret_name created${NC}"
}

# Prompt for values
echo -e "${YELLOW}Enter your secret values (leave blank to skip):${NC}\n"

read -p "MongoDB Connection String: " MONGODB_URI
read -p "JWT Secret (or press Enter to generate): " JWT_SECRET
read -p "Twilio Account SID: " TWILIO_SID
read -sp "Twilio Auth Token: " TWILIO_TOKEN
echo ""

# Generate JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated JWT Secret: $JWT_SECRET${NC}"
fi

# Create secrets
echo -e "\n${YELLOW}Creating secrets...${NC}\n"

if [ -n "$MONGODB_URI" ]; then
    create_secret "planexa-mongodb-uri" "$MONGODB_URI" "MongoDB Atlas connection string"
fi

create_secret "planexa-jwt-secret" "$JWT_SECRET" "JWT signing secret"

# Google API Key (hardcoded for now)
create_secret "planexa-google-api-key" "AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM" "Google API Key for Gemini"

if [ -n "$TWILIO_SID" ]; then
    create_secret "planexa-twilio-account-sid" "$TWILIO_SID" "Twilio Account SID"
fi

if [ -n "$TWILIO_TOKEN" ]; then
    create_secret "planexa-twilio-auth-token" "$TWILIO_TOKEN" "Twilio Auth Token"
fi

echo -e "\n${GREEN}✅ All secrets configured!${NC}"
echo -e "\n${YELLOW}📋 Created secrets:${NC}"
gcloud secrets list --project="$PROJECT_ID" --filter="name:planexa"
