# Orders App

REST API for order management with batch processing.

## Tech Stack

- Java 17
- Spring Boot 4
- Spring Batch
- Spring Data JPA
- H2 (in-memory database)

## Requirements

- JDK 17+
- Maven 3.8+

## Run the project

```bash
./mvnw spring-boot:run
```

The application starts at `http://localhost:8080`.

## Endpoints

### Create order
```
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "product": "Keyboard",
  "quantity": 2
}
```

### Get orders
```
GET /api/orders
GET /api/orders?status=NEW
GET /api/orders?status=PROCESSED
GET /api/orders?status=FAILED
```

### Run batch process
```
POST /api/orders/batch/run
```

Processes all orders with status `NEW` and updates them to `PROCESSED` or `FAILED`.

## H2 Console

Available at `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:ordersdb`
- Username: `sa`
- Password: _(empty)_
