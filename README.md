# Phishing Detection System 🚨

A **full-stack phishing detection application** that:

- Detects phishing websites using:
  - **Machine Learning (ML) model**
  - **Google Safe Browsing API**
  - **AbuseIPDB API**
- **Stores search history on the Ethereum blockchain** via MetaMask and Ganache.
- Features **JWT-based authentication** for secure access.

---

## 🚀 Live Demo

- **Frontend**: [https://phishingdetectionproject.netlify.app/](https://phishingdetectionproject.netlify.app/)
- **Backend**: [https://phishing-detection-2gew.onrender.com](https://phishing-detection-2gew.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend**: React, Styled-Components, Web3.js
- **Backend**: Flask, Flask-CORS, scikit-learn, Web3.py
- **Blockchain**: Solidity Smart Contract, Ganache, MetaMask
- **APIs**: Google Safe Browsing, AbuseIPDB

---

## 📂 Project Structure

```
phishing-detection/
├── backend/       # Flask backend (API + ML model)
│   ├── app.py
│   ├── phishing_model.pkl
│   └── requirements.txt
├── frontend/      # React frontend
│   ├── src/
│   └── package.json
├── contracts/     # Solidity smart contract (PhishingDetection.sol)
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend (Flask)

1. **Navigate to backend folder**:

```bash
cd backend
```

2. **Create a virtual environment**:

```bash
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Create a `.env` file** in `backend/`:

```bash
GOOGLE_API_KEY=your-google-api-key
ABUSEIPDB_API_KEY=your-abuseipdb-api-key
JWT_SECRET_KEY=your-jwt-secret
```

5. **Run Flask app**:

```bash
python app.py
```

---

### Frontend (React)

1. **Navigate to frontend folder**:

```bash
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create a `.env` file** in `frontend/`:

```bash
REACT_APP_BACKEND_URL=https://phishing-detection-2gew.onrender.com
```

4. **Run frontend**:

```bash
npm start
```

---

### Blockchain (Ganache + MetaMask)

1. Start **Ganache**:

```bash
ganache
```

2. Deploy **PhishingDetection.sol** via **Remix** (connect MetaMask → Ganache).

3. Update:

- **frontend/src/contracts/contractAddress.js** with deployed contract address.
- **frontend/src/contracts/contractABI.json** with ABI.

---

## 📊 Architecture Overview

```
Frontend (React)
     |
     |---> Backend (Flask API)
                |
                |---> ML Model (scikit-learn)
                |---> Google Safe Browsing API
                |---> AbuseIPDB API
     |
     |---> Blockchain (Ethereum Smart Contract via Web3)
```

---

## 🌟 Features

- **Phishing Detection**:
  - ML model-based analysis.
  - Google Safe Browsing & AbuseIPDB cross-verification.
- **Blockchain Storage**:
  - Search results saved on Ethereum blockchain.
  - MetaMask wallet interaction.
- **Authentication**:
  - JWT-based login.

---

## 🎥 Presentation Video

- (https://www.loom.com/share/8df158b65d7b4b599160b0c26c4967b8?sid=7a15851c-7bf1-4c69-9a80-73c85c7106f0)

---


---

## ✨ Author

- **Okechukwu Nnuji John**

