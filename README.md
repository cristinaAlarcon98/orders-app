# Orders App

Fullstack application for order management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 4, Spring Batch, H2 |
| Frontend | Angular 21, Bootstrap 5, ngx-translate |

---

## Prerequisites

- Java 17+
- Node.js 18+ and npm

---

## Backend

```bash
cd orders
./mvnw spring-boot:run
```

API runs at `http://localhost:8080`.

> H2 is an in-memory database — data resets on every restart.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| POST | `/api/orders/batch/run` | Process NEW orders |
| GET | `/api/products` | List available products |

---

## Frontend

```bash
cd orders-frontend
npm install
npm start
```

App runs at `http://localhost:4200`.

---

## Running the app

1. Start the backend
2. Start the frontend
3. Open `http://localhost:4200`
