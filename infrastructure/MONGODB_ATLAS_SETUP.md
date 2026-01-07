# 🍃 MongoDB Atlas Setup for Planexa

Complete guide to setting up MongoDB Atlas with Google Cloud VPC Peering.

## 📋 Prerequisites

- MongoDB Atlas account (free tier works for testing)
- Google Cloud project with VPC created
- Admin access to both platforms

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Cluster

1. **Log in** to [MongoDB Atlas](https://cloud.mongodb.com)

2. **Create a new project** called `Planexa`

3. **Build a cluster**:
   - Choose **Google Cloud** as provider
   - Select **Montreal (northamerica-northeast1)** region
   - Choose tier:
     - **M0** (free) - Testing only, no VPC peering
     - **M10+** (paid) - Production with VPC peering

4. **Wait** for cluster to provision (~5-10 minutes)

### Step 2: Create Database User

1. Go to **Database Access** → **Add New Database User**

2. **Authentication Method**: Password

3. **User Details**:
   ```
   Username: planexa-app
   Password: <generate-strong-password>
   ```

4. **Built-in Role**: `readWrite` on `planexa` database

5. **Add User**

### Step 3: Configure Network Access

#### Option A: IP Whitelist (Quick Start)

1. Go to **Network Access** → **Add IP Address**

2. For testing: **Allow Access from Anywhere** (0.0.0.0/0)
   > ⚠️ Not recommended for production

3. For production: Add Google Cloud NAT IP ranges

#### Option B: VPC Peering (Recommended for Production)

1. Go to **Network Access** → **Peering** → **Add Peering Connection**

2. **Configure Atlas Side**:
   ```
   Cloud Provider: Google Cloud
   GCP Project ID: your-project-id
   VPC Name: planexa-vpc
   ```

3. **Copy the Atlas side info**:
   - GCP Project ID (Atlas)
   - VPC Network Name (Atlas)

4. **Configure GCP Side**:

   ```bash
   # Create peering from GCP to Atlas
   gcloud compute networks peerings create planexa-atlas-peering \
     --network=planexa-vpc \
     --peer-project=<atlas-gcp-project-id> \
     --peer-network=<atlas-vpc-network-name>
   ```

5. **Wait** for peering to become active (both sides)

### Step 4: Get Connection String

1. Go to **Database** → **Connect**

2. Choose **Connect your application**

3. **Driver**: Node.js, Version 5.5+

4. **Copy connection string**:
   ```
   mongodb+srv://planexa-app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace** `<password>` with your actual password

6. **Add database name**:
   ```
   mongodb+srv://planexa-app:password@cluster0.xxxxx.mongodb.net/planexa?retryWrites=true&w=majority
   ```

### Step 5: Store in Secret Manager

```bash
# Store connection string
gcloud secrets create planexa-mongodb-uri \
  --replication-policy="automatic"

echo -n "mongodb+srv://planexa-app:password@cluster0.xxxxx.mongodb.net/planexa?retryWrites=true&w=majority" | \
  gcloud secrets versions add planexa-mongodb-uri --data-file=-
```

## 🔧 Mongoose Models

The existing Mongoose models continue to work. Example structure:

```javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hashedPassword: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
```

```javascript
// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: String,
  clientEmail: String,
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Booking', bookingSchema);
```

## 📊 Atlas Features to Enable

### Recommended Settings

| Feature | Setting |
|---------|---------|
| **Auto-scaling** | Enable for storage |
| **Backup** | Continuous backup |
| **Monitoring** | Enable all alerts |
| **Encryption** | Enable at-rest encryption |

### Indexes

Create indexes for common queries:

```javascript
// In your models or via Atlas UI
db.bookings.createIndex({ userId: 1, startTime: -1 });
db.bookings.createIndex({ status: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
```

## 🔒 Security Best Practices

1. **Use strong passwords** - Generate with `openssl rand -base64 32`
2. **Enable VPC peering** - No public internet access
3. **Enable audit logs** - Track database access
4. **Rotate credentials** - Change passwords quarterly
5. **Use least privilege** - Only grant necessary permissions

## 💰 Pricing

| Tier | Monthly Cost | Features |
|------|-------------|----------|
| M0 (Free) | $0 | 512MB, no VPC |
| M10 | ~$57 | 2GB, VPC peering |
| M30 | ~$175 | 8GB, dedicated |
| M50+ | $400+ | Production-grade |

## 🐛 Troubleshooting

### Connection timeout

```bash
# Test from Cloud Shell
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/planexa" \
  --username planexa-app \
  --password <password>
```

### Authentication failed

1. Verify username/password
2. Check database user role
3. Ensure correct database name in URI

### VPC peering not working

1. Check peering status on both sides
2. Verify CIDR ranges don't overlap
3. Check firewall rules in GCP

---

**Need help?** Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
