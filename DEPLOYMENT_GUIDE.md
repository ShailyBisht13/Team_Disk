# 🚀 Deployment Guide for Road Damage AI System

Since your project uses a **Hybrid Stack** (Node.js Backend + Python AI + MongoDB), standard "free tier" hosting (like Vercel/Netlify for backend) **will not work** because they don't support running persistent Python AI scripts alongside Node.js.

## Recommended Strategy: **VPS (Virtual Private Server)**
You need a server where you can install both Node.js and Python (and system libraries for OpenCV).
**Providers**: DigitalOcean ($6/mo), AWS EC2 (Free Tier), or Render (Docker).

---

## ✅ Step 1: Prepare Code for Production

### A. Frontend (React)
1.  **Remove Hardcoded URLs**: You have `http://localhost:5000` in many files (`AdminLogin.jsx`, `UserLogin.jsx`, etc.).
2.  **Use Environment Variable**:
    -   Create a `.env` file in `frontend`:
        ```env
        REACT_APP_BACKEND_URL=https://your-backend-domain.com
        ```
    -   Replace code: `const backend = process.env.REACT_APP_BACKEND_URL;`

### B. Backend (Node + Python)
1.  **Environment Variables**: Ensure `.env` is **NOT** committed to Git, but you have the keys ready for the server.
2.  **Python Requirements**: Ensure `backend/main-backend/ai/requirements.txt` exists and lists `ultralytics`, `opencv-python`, etc.
3.  **Path Handling**: We have already fixed most paths to be dynamic (`__dirname`), but ensure no `C:\Users` paths remain in `server.js` or `aiProcessor.js`.

---

## ☁️ Step 2: Deploy Frontend (Easy)
1.  Push code to **GitHub**.
2.  Go to **Vercel** or **Netlify**.
3.  Import your repository.
4.  Set Build Command: `npm run build`
5.  **Environment Variables**: Add `REACT_APP_BACKEND_URL` pointing to your future backend URL.

---

## 🖥️ Step 3: Deploy Backend (The Hard Part)

### Option A: Railway / Render (Containerized)
This is easiest if you don't want to manage a server.
1.  Create a `Dockerfile` in the root `backend` folder.
2.  It must install **Python**, **Node**, and **GLib** (for OpenCV).
    ```dockerfile
    FROM node:18
    
    # 1. Install Python & System Dependencies (for OpenCV)
    RUN apt-get update && apt-get install -y python3 python3-pip python3-venv libgl1 libglib2.0-0
    
    # 2. Setup Node App
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    
    # 3. Setup Python Virtual Env
    COPY main-backend/ai/requirements.txt ./ai_reqs.txt
    RUN python3 -m venv .venv
    RUN . .venv/bin/activate && pip install -r ai_reqs.txt
    
    # 4. Copy Code
    COPY . .
    
    # 5. Start
    CMD ["node", "server.js"]
    ```
3.  Deploy this Dockerfile to Railway/Render.

### Option B: VPS (DigitalOcean/AWS)
1.  **SSH into Server**: `ssh root@your-ip`
2.  **Install tools**: `apt install nodejs npm python3 python3-pip python3-venv`
3.  **Clone Repo**: `git clone https://github.com/ShailyBisht13/Team_Disk.git`
4.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Setup Python
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r main-backend/ai/requirements.txt
    ```
5.  **Run with PM2**: `npm install -g pm2`, then `pm2 start server.js`.

---

## 🚦 Summary
1.  **Frontend**: Vercel (Free).
2.  **Database**: MongoDB Atlas (Free).
3.  **Backend**: Must use a **VPS** or **Docker** due to the Python AI requirement.
