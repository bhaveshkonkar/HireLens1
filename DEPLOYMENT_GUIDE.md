# Deployment Guide for OmniSense Suite

Since your workspace contains multiple independent applications (Root, AlgoVision, Code Interviewer, etc.), the best way to deploy them to Vercel is as **separate projects** from the same GitHub repository.

## Prerequisites

1.  **Push to GitHub**: Ensure this entire folder is pushed to a GitHub repository.
2.  **Vercel Account**: Log in to [vercel.com](https://vercel.com).
3.  **API Key**: Have your Gemini API Key ready.

---

## Deployment Strategy

You will create **4 separate Vercel projects**, one for each application.

### 1. Deploying the Main App (Root)

1.  On Vercel, click **"Add New..."** -> **"Project"**.
2.  Import your repository.
3.  **Configure Project:**
    *   **Project Name:** `omnisense-main` (or your choice)
    *   **Root Directory:** Leave as `./` (default).
    *   **Framework Preset:** Vite (should detect automatically).
    *   **Environment Variables:**
        *   Key: `GEMINI_API_KEY`
        *   Value: `your_actual_api_key_here`
4.  Click **Deploy**.

### 2. Deploying AlgoVision Pro

1.  Dashboard -> **"Add New..."** -> **"Project"**.
2.  Import the **SAME** repository again.
3.  **Configure Project:**
    *   **Project Name:** `algovision-pro`
    *   **Root Directory:** Click "Edit" and select `algovision-pro`.
    *   **Environment Variables:**
        *   Key: `GEMINI_API_KEY`
        *   Value: `your_actual_api_key_here`
4.  Click **Deploy**.

### 3. Deploying Gemini Code Interviewer

1.  Dashboard -> **"Add New..."** -> **"Project"**.
2.  Import the **SAME** repository again.
3.  **Configure Project:**
    *   **Project Name:** `gemini-code-interviewer`
    *   **Root Directory:** Click "Edit" and select `gemini-code-interviewer`.
    *   **Environment Variables:**
        *   Key: `GEMINI_API_KEY`
        *   Value: `your_actual_api_key_here`
4.  Click **Deploy**.

### 4. Deploying Hologram Algorithm Engine

1.  Dashboard -> **"Add New..."** -> **"Project"**.
2.  Import the **SAME** repository again.
3.  **Configure Project:**
    *   **Project Name:** `hologram-engine`
    *   **Root Directory:** Click "Edit" and select `hologram-algorithm-engine`.
    *   **Environment Variables:**
        *   Key: `GEMINI_API_KEY`
        *   Value: `your_actual_api_key_here`
4.  Click **Deploy**.

---

## Why this method?

*   **Independence:** If you break the Interviewer app, the AlgoVision app stays online.
*   **Subdomains:** You get clean URLs like `algovision.vercel.app` and `omnisense.vercel.app`.
*   **Faster Builds:** Vercel only rebuilds the specific app that changed (if configured with "Ignored Build Step" command, usually default settings work fine).
