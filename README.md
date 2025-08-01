Here is a `README.md` file tailored to your project structure and setup:

---

```markdown
# AI-Assisted Disease Analysis Platform

This repository contains a full-stack medical AI system for disease analysis and patient management. It consists of:

-  **Backend** powered by FastAPI for API handling, authentication, and AI inference.
-  **Frontend** built with React for user interaction (admin, doctor, and nurse dashboards).
-  **AI Model** based on MedCLIP with custom fine-tuned weights.

---

## Features

- Role-based dashboards for Admins, Doctors, and Nurses.
- Medical image analysis using fine-tuned MedCLIP weights.
- Patient and disease management system.
- Integrated AI history tracking for diagnosis.

---

## Project Structure

```

/frontend       → React App
/backend        → FastAPI Backend

````

---

## Setup Instructions

### 1. Clone the Repository
### 2. Backend (FastAPI)

#### Create and activate virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Download pretrained MedCLIP

Clone the official MedCLIP repo to get the pretrained backbone:

```bash
git clone https://github.com/RyanWangZf/MedCLIP
```

Then copy the necessary files (e.g., `medclip-vit`) into:

```
backend/presentation/pretrained/medclip-vit/
```

#### Place fine-tuned weights

My fine-tuned model weights (≈747MB) are not included due to GitHub size limits. Please contact me to get the file and place it at:

```
backend/infrastructure/ai/weights/best_model.pth
```

---

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## Authentication

* JWT-based login and role-based access
* Use `/api/v1/login` to get your access token

---

## AI Inference

* Model used: Swin Transformer + BioClinicalBERT (MedCLIP-based)
* Trained using a contrastive loss on disease descriptions and images

---

## Notes

* `.env` configuration files are required for proper database and secret management.
* Images are uploaded to `backend/presentation/uploads/`.
* Trained phrases/descriptions are stored in PostgreSQL.

---

## Contact

If you need the trained model weights or have any questions, feel free to reach out.

---
