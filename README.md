#  FuelEU Maritime Compliance System

---

## Overview

This project is a full-stack implementation of a **FuelEU Maritime compliance platform**.
It enables tracking and management of emissions compliance for shipping routes using:

* Compliance Balance (CB)
* Banking system (Article 20)
* Pooling system (Article 21)

The system is designed with a focus on **clean architecture**, **correct domain modeling**, and **AI-assisted development**.

---

##  Architecture Summary (Hexagonal Architecture)

The backend follows a **Hexagonal (Ports & Adapters)** architecture:

```text
core (business logic)
  ↓
ports (interfaces)
  ↓
adapters (API, DB)
  ↓
config (Express, PostgreSQL)
```

### Key Layers:

* **Core**

  * Contains domain logic (CB, banking, pooling)
  * No dependency on external systems

* **Ports**

  * Defines interfaces for repositories and services

* **Adapters**

  * Implements APIs and database interactions

* **Frontend**

  * React-based UI
  * Communicates via REST APIs

---

##  Setup & Run Instructions
### 🔹 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs at:

http://localhost:5000

---

### 🔹 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173


---

##  Running Tests

### Backend Tests

```bash
cd backend
npm run test
```

* Uses **Jest**
*  Tests Compliance Balance logic

---

### Frontend Test Command

```bash
cd frontend
npm run test
```

(Currently placeholder to satisfy assignment requirement)

---

## API Endpoints

### Routes

* `GET /routes` → Fetch all routes
* `POST /routes/:id/baseline` → Set baseline
* `GET /routes/comparison` → Compare with baseline

---

### Compliance Balance

* `GET /routes/cb` → Calculate CB

---

### Banking 

* `POST /routes/banking/bank` → Bank surplus
* `POST /routes/banking/apply` → Apply bank
* `GET /routes/banking/records` → View records

---

### Pooling 

* `POST /routes/pooling/create` → Create pool
* `POST /routes/pooling/add` → Add route to pool
* `POST /routes/pooling/evaluate` → Evaluate pool

---

##  Sample API Response

### 🔹 Compliance Balance

```json
{
  "routeId": "R001",
  "complianceBalance": 263082240,
  "status": "Surplus"
}
```

---

### 🔹 Banking Apply

```json
{
  "routeId": "R002",
  "originalCB": -300000,
  "bankUsed": 100000,
  "adjustedCB": -200000,
  "status": "Deficit"
}
```

---

### 🔹 Pooling Result

```json
{
  "totalCB": 150000,
  "status": "Compliant",
  "transfers": [
    { "from": "R001", "to": "R002", "amount": 50000 }
  ]
}
```

##

---

##  Key Highlights

* Ledger-based banking system (audit-safe)
* Greedy algorithm for pooling allocation
* Clean separation of concerns (Hexagonal Architecture)
* AI-assisted development with validation

---

##  Conclusion

This project demonstrates:

* Strong backend architecture
* Correct implementation of domain logic
* Effective use of AI tools with manual validation

---
