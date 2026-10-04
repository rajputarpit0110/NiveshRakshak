# 🚀 NiveshRakshak Deployment: Vercel (Frontend) + Render (Backend & AI)

This guide walks you through deploying:
1. **Backend & AI Microservices on Render** (FastAPI RAG + Node.js API)
2. **Frontend on Vercel** (Global Edge CDN for React + Vite)

---

## 🟢 Part 1: Deploy Backend & AI Service on Render (First)

Because the frontend connects to your backend API, deploy the backend services on Render first to obtain your live backend URL.

### Option A: 1-Click Render Blueprint (Fastest)
1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in with your GitHub account.
2. Click **New +** (top right) → **Blueprint**.
3. Connect your repository:
   ```
   rajputarpit0110/NiveshRakshak
   ```
4. Render will read [`render.yaml`](./render.yaml) and automatically create:
   - 🧠 **`niveshrakshak-ai`** (Python 3.11 FastAPI RAG engine)
   - ⚙️ **`niveshrakshak-backend`** (Node.js Express orchestration API)
5. Click **Apply**.
6. When deployment finishes, copy your backend URL:
   ```
   https://niveshrakshak-backend.onrender.com
   ```

### Option B: Manual Web Service on Render (If not using Blueprint)
If you prefer creating them manually:

#### 1. AI Service:
- **New +** → **Web Service** → Select `rajputarpit0110/NiveshRakshak`
- **Name:** `niveshrakshak-ai`
- **Root Directory:** `ai-service`
- **Runtime:** `Python 3`
- **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free
- Copy the deployed URL (e.g. `https://niveshrakshak-ai.onrender.com`)

#### 2. Backend Service:
- **New +** → **Web Service** → Select `rajputarpit0110/NiveshRakshak`
- **Name:** `niveshrakshak-backend`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_ENV`: `production`
  - `AI_SERVICE_URL`: `<URL of deployed niveshrakshak-ai>`
  - `JWT_SECRET`: `any_long_random_secret_key`
- Copy the deployed backend URL (e.g. `https://niveshrakshak-backend.onrender.com`)

---

## ⚡ Part 2: Deploy Frontend on Vercel

### Step 1: Open Vercel Dashboard
1. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **Add New...** → **Project**.

### Step 2: Import Repository
1. Select your GitHub repository:
   ```
   rajputarpit0110/NiveshRakshak
   ```

### Step 3: Configure Project Settings on Vercel
1. **Framework Preset:** `Vite` (auto-detected).
2. **Root Directory:** Click **Edit** and set it to:
   ```
   frontend
   ```
3. **Build & Output Settings:**
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

### Step 4: Add Environment Variable
Under **Environment Variables**, add:
- **Key:** `VITE_API_URL`
- **Value:** `https://<your-render-backend-name>.onrender.com/api`
  *(e.g., `https://niveshrakshak-backend.onrender.com/api`)*

### Step 5: Click Deploy
1. Click **Deploy**.
2. Within 60 seconds, Vercel will build and assign you a global CDN domain, such as:
   ```
   https://niveshrakshak.vercel.app
   ```

---

## ✅ Part 3: Verification Checklist

Once both are deployed:

1. **Verify Backend Health:**
   ```bash
   curl https://<your-backend>.onrender.com/health
   # Returns: {"status":"healthy","service":"NiveshRakshak-Backend",...}
   ```

2. **Verify AI RAG Health:**
   ```bash
   curl https://<your-ai-service>.onrender.com/health
   # Returns: {"status":"healthy","service":"NiveshRakshak-AI-Service","knowledge_base":{"total_chunks":354,...}}
   ```

3. **Verify Vercel Web App:**
   - Open your Vercel URL: `https://<your-app>.vercel.app`
   - Ask a question in the AI Rights Assistant or run a Grievance draft.
   - All RAG responses, document audits, and scam radar checks will load live from your Render backend!
