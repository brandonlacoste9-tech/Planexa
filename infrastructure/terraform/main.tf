# ============================================================================
# PLANEXA - Google Cloud Infrastructure
# Serverless MERN Stack Deployment
# ============================================================================

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Remote state in GCS (uncomment after first run)
  # backend "gcs" {
  #   bucket = "planexa-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# ============================================================================
# VARIABLES
# ============================================================================

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "Primary region for resources"
  type        = string
  default     = "northamerica-northeast1" # Montreal
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
  default     = "planexo.ca"
}

variable "mongodb_connection_string" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "google_api_key" {
  description = "Google API Key for Gemini"
  type        = string
  sensitive   = true
  default     = "AIzaSyBeCTCYPbJr0SjBH1qTStJVntFBpkUzmvM"
}

variable "twilio_account_sid" {
  description = "Twilio Account SID"
  type        = string
  sensitive   = true
  default     = ""
}

variable "twilio_auth_token" {
  description = "Twilio Auth Token"
  type        = string
  sensitive   = true
  default     = ""
}

# ============================================================================
# PROVIDERS
# ============================================================================

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# ============================================================================
# ENABLE APIS
# ============================================================================

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "compute.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com",
    "generativelanguage.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

# ============================================================================
# SECRET MANAGER - Store sensitive values
# ============================================================================

resource "google_secret_manager_secret" "mongodb_uri" {
  secret_id = "planexa-mongodb-uri"
  
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "mongodb_uri" {
  secret      = google_secret_manager_secret.mongodb_uri.id
  secret_data = var.mongodb_connection_string
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "planexa-jwt-secret"
  
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = var.jwt_secret
}

resource "google_secret_manager_secret" "google_api_key" {
  secret_id = "planexa-google-api-key"
  
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "google_api_key" {
  secret      = google_secret_manager_secret.google_api_key.id
  secret_data = var.google_api_key
}

resource "google_secret_manager_secret" "twilio_account_sid" {
  secret_id = "planexa-twilio-account-sid"
  
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "twilio_account_sid" {
  secret      = google_secret_manager_secret.twilio_account_sid.id
  secret_data = var.twilio_account_sid != "" ? var.twilio_account_sid : "placeholder"
}

resource "google_secret_manager_secret" "twilio_auth_token" {
  secret_id = "planexa-twilio-auth-token"
  
  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "twilio_auth_token" {
  secret      = google_secret_manager_secret.twilio_auth_token.id
  secret_data = var.twilio_auth_token != "" ? var.twilio_auth_token : "placeholder"
}

# ============================================================================
# VPC NETWORK - For MongoDB Atlas peering
# ============================================================================

resource "google_compute_network" "planexa_vpc" {
  name                    = "planexa-vpc"
  auto_create_subnetworks = false
  
  depends_on = [google_project_service.apis]
}

resource "google_compute_subnetwork" "planexa_subnet" {
  name          = "planexa-subnet-${var.region}"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.planexa_vpc.id

  private_ip_google_access = true
}

# VPC Connector for Cloud Run to access MongoDB
resource "google_vpc_access_connector" "planexa_connector" {
  name          = "planexa-vpc-connector"
  region        = var.region
  network       = google_compute_network.planexa_vpc.name
  ip_cidr_range = "10.8.0.0/28"
  
  min_instances = 2
  max_instances = 3

  depends_on = [google_project_service.apis]
}

# ============================================================================
# CLOUD STORAGE - Frontend static assets
# ============================================================================

resource "google_storage_bucket" "frontend" {
  name          = "${var.project_id}-planexa-frontend"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html" # SPA fallback
  }

  cors {
    origin          = ["https://${var.domain}", "https://www.${var.domain}"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  depends_on = [google_project_service.apis]
}

# Make bucket publicly readable
resource "google_storage_bucket_iam_member" "frontend_public" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# ============================================================================
# ARTIFACT REGISTRY - Docker images
# ============================================================================

resource "google_artifact_registry_repository" "planexa" {
  location      = var.region
  repository_id = "planexa"
  description   = "Docker images for Planexa"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}

# ============================================================================
# CLOUD RUN - Backend API
# ============================================================================

resource "google_cloud_run_v2_service" "backend" {
  name     = "planexa-backend"
  location = var.region
  
  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    vpc_access {
      connector = google_vpc_access_connector.planexa_connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/planexa/backend:latest"

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name = "MONGODB_URI"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.mongodb_uri.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "GOOGLE_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.google_api_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "TWILIO_ACCOUNT_SID"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.twilio_account_sid.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "TWILIO_AUTH_TOKEN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.twilio_auth_token.secret_id
            version = "latest"
          }
        }
      }

      startup_probe {
        http_get {
          path = "/"
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/"
        }
        period_seconds = 30
      }
    }

    service_account = google_service_account.cloud_run.email
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.apis,
    google_secret_manager_secret_version.mongodb_uri,
    google_secret_manager_secret_version.jwt_secret,
    google_secret_manager_secret_version.google_api_key,
  ]
}

# Allow unauthenticated access (public API)
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ============================================================================
# SERVICE ACCOUNT
# ============================================================================

resource "google_service_account" "cloud_run" {
  account_id   = "planexa-cloud-run"
  display_name = "Planexa Cloud Run Service Account"
}

# Grant access to secrets
resource "google_secret_manager_secret_iam_member" "mongodb_access" {
  secret_id = google_secret_manager_secret.mongodb_uri.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "jwt_access" {
  secret_id = google_secret_manager_secret.jwt_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "google_api_access" {
  secret_id = google_secret_manager_secret.google_api_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "twilio_sid_access" {
  secret_id = google_secret_manager_secret.twilio_account_sid.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_secret_manager_secret_iam_member" "twilio_token_access" {
  secret_id = google_secret_manager_secret.twilio_auth_token.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run.email}"
}

# ============================================================================
# GLOBAL LOAD BALANCER
# ============================================================================

# Reserve global IP
resource "google_compute_global_address" "planexa" {
  name = "planexa-global-ip"

  depends_on = [google_project_service.apis]
}

# Backend bucket for frontend
resource "google_compute_backend_bucket" "frontend" {
  name        = "planexa-frontend-bucket"
  bucket_name = google_storage_bucket.frontend.name
  enable_cdn  = true

  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 3600
    max_ttl           = 86400
    serve_while_stale = 86400
  }
}

# Network Endpoint Group for Cloud Run
resource "google_compute_region_network_endpoint_group" "backend" {
  name                  = "planexa-backend-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  
  cloud_run {
    service = google_cloud_run_v2_service.backend.name
  }
}

# Backend service for Cloud Run
resource "google_compute_backend_service" "backend" {
  name        = "planexa-backend-service"
  protocol    = "HTTP"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.backend.id
  }
}

# URL Map - Route traffic
resource "google_compute_url_map" "planexa" {
  name            = "planexa-url-map"
  default_service = google_compute_backend_bucket.frontend.id

  host_rule {
    hosts        = [var.domain, "www.${var.domain}"]
    path_matcher = "main"
  }

  path_matcher {
    name            = "main"
    default_service = google_compute_backend_bucket.frontend.id

    # Route /api/* to Cloud Run backend
    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.backend.id
    }
  }
}

# HTTPS Proxy
resource "google_compute_target_https_proxy" "planexa" {
  name             = "planexa-https-proxy"
  url_map          = google_compute_url_map.planexa.id
  ssl_certificates = [google_compute_managed_ssl_certificate.planexa.id]
}

# HTTP Proxy (for redirect)
resource "google_compute_target_http_proxy" "planexa" {
  name    = "planexa-http-proxy"
  url_map = google_compute_url_map.http_redirect.id
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "http_redirect" {
  name = "planexa-http-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

# Managed SSL Certificate
resource "google_compute_managed_ssl_certificate" "planexa" {
  name = "planexa-ssl-cert"

  managed {
    domains = [var.domain, "www.${var.domain}"]
  }
}

# Global Forwarding Rules
resource "google_compute_global_forwarding_rule" "https" {
  name       = "planexa-https-rule"
  target     = google_compute_target_https_proxy.planexa.id
  port_range = "443"
  ip_address = google_compute_global_address.planexa.address
}

resource "google_compute_global_forwarding_rule" "http" {
  name       = "planexa-http-rule"
  target     = google_compute_target_http_proxy.planexa.id
  port_range = "80"
  ip_address = google_compute_global_address.planexa.address
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "load_balancer_ip" {
  description = "Global Load Balancer IP address"
  value       = google_compute_global_address.planexa.address
}

output "backend_url" {
  description = "Cloud Run backend URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_bucket" {
  description = "Frontend storage bucket"
  value       = google_storage_bucket.frontend.url
}

output "artifact_registry" {
  description = "Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/planexa"
}

output "dns_instructions" {
  description = "DNS configuration instructions"
  value       = <<-EOT
    Configure your DNS with these records:
    
    ${var.domain}     A     ${google_compute_global_address.planexa.address}
    www.${var.domain} A     ${google_compute_global_address.planexa.address}
    
    SSL certificate will auto-provision after DNS propagation.
  EOT
}
