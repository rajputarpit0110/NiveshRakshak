# 🚀 NiveshRakshak Deployment Guide

This guide explains how to deploy **NiveshRakshak** to **Render** using the included automated Blueprint (`render.yaml`).

---

## ⚡ Method 1: 1-Click Render Blueprint (Recommended)

Render provides automated multi-service provisioning using the repository's [`render.yaml`](./render.yaml).

### Step 1: Create an Account on Render
1. Go to [render.com](https://render.com) and log in with your GitHub account.

### Step 2: Create a New Blueprint Instance
1. In the Render Dashboard, click **New +** (top right) and select **Blueprint**.
2. Connect your GitHub repository:
   ```
   rajputarpit0110/NiveshRakshak
   ```
3. Render will parse [`render.yaml`](./render.yaml) and automatically detect all 3 services:
   - 🧠 **`niveshrakshak-ai`**: Python 3.11 FastAPI microservice with 354 pre-indexed RAG chunks
   - ⚙️ **`niveshrakshak-backend`**: Node.js Express orchestration API
   - 💻 **`niveshrakshak-frontend`**: React + Vite + Tailwind static application

### Step 3: Apply & Deploy
1. Click **Apply**.
2. Render will build and deploy the services in sequence:
   - `niveshrakshak-ai` installs `requirements.txt` and starts on uvicorn.
   - `niveshrakshak-backend` connects directly to the internal AI service URL.
   - `niveshrakshak-frontend` compiles Vite and serves the SPA with clean rewrites.
3. Once the build completes (approx. 2-3 minutes), you will receive your live URL:
   - **Frontend:** `https://niveshrakshak-frontend.onrender.com`
   - **Backend API:** `https://niveshrakshak-backend.onrender.com`
   - **AI Microservice:** `https://niveshrakshak-ai.onrender.com`

---

## 🌐 Method 2: Manual Service Creation on Render

If you prefer to configure each service manually without Blueprint:

### 1. Deploy Python AI Service
- Click **New +** → **Web Service**
- Repository: `rajputarpit0110/NiveshRakshak`
- **Root Directory:** `ai-service`
- **Runtime:** `Python 3`
- **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free

### 2. Deploy Node.js Backend
- Click **New +** → **Web Service**
- Repository: `rajputarpit0110/NiveshRakshak`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_ENV`: `production`
  - `AI_SERVICE_URL`: `<URL of deployed niveshrakshak-ai>`
  - `JWT_SECRET`: `your_random_secret_string`

### 3. Deploy Frontend (Static Site)
- Click **New +** → **Static Site**
- Repository: `rajputarpit0110/NiveshRakshak`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: `<URL of deployed backend>/api`
- **Redirects/Rewrites:**
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`

---

## 🐳 Method 3: Self-Hosted Docker Compose

To deploy on any Ubuntu/Debian VPS (AWS EC2, DigitalOcean, Hetzner, etc.):

```bash
# Clone the repository
git clone https://github.com/rajputarpit0110/NiveshRakshak.git
cd NiveshRakshak

# Build and start all 3 services in detached mode
docker compose up -d --build

# View container logs
docker compose logs -f
```

The application will be live at:
- **Frontend:** `http://<your-server-ip>`
- **Backend API:** `http://<your-server-ip>:5001`
- **AI Service:** `http://<your-server-ip>:8000`

---

## 🔍 Verification & Health Check

After deployment, verify the endpoints:
```bash
# AI Microservice Health
curl https://<your-ai-service>.onrender.com/health

# Backend Health
curl https://<your-backend>.onrender.com/health
```
Both will return `{"status": "healthy"}`.
