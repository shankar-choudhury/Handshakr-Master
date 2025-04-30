# Handshakr Prototype (Backend)

Please visit [https://handshakr.duckdns.org](https://handshakr.duckdns.org) to interact with the deployed application.

For documentation, please copy contents of backend/apidocs to your machine and then open the "allclasses-index.html" file in web browser. 

For commit history, please check original repo: https://github.com/shankar-choudhury/handshakr_proto

## 🛠 Tech Stack
**Backend:** Spring Boot 3.4.3 (Java 21)  
**Database:** PostgreSQL  
**Security:** JWT, PBKDF2 password encoding, CSRF tokens  
**Testing:** Testcontainers, JUnit 5  
**Tools:** Lombok, Hibernate Validator

---

## 📦 Tech Stack & Dependencies

### Core Frameworks

| Dependency | Purpose | Version |
|-----------|---------|---------|
| [Spring Boot](https://spring.io/projects/spring-boot) | Application framework | 3.4.3 |
| [Spring Security](https://spring.io/projects/spring-security) | Authentication/Authorization | 6.4.3 |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | Database ORM | 3.2.5 |
| [Spring Validation](https://docs.spring.io/spring-framework/reference/core/validation.html) | Request validation | 6.1.6 |

### Security

| Dependency | Purpose | Version |
|-----------|---------|---------|
| [JJWT](https://github.com/jwtk/jjwt) | JWT token generation/validation | 0.12.6 |
| PBKDF2 | Password hashing | (Spring-managed) |

### Database

| Dependency | Purpose | Version |
|-----------|---------|---------|
| [PostgreSQL Driver](https://jdbc.postgresql.org/) | Database driver | 42.7.3 |
| [Hibernate](https://hibernate.org/orm/) | JPA implementation | 6.4.4 |

### Utilities

| Dependency | Purpose | Version |
|-----------|---------|---------|
| [Lombok](https://projectlombok.org/) | Boilerplate reduction | 1.18.30 |
| [Jakarta Validation](https://jakarta.ee/specifications/bean-validation/3.0/) | Input validation | 3.0.2 |

### Testing

| Dependency | Purpose | Version |
|-----------|---------|---------|
| [JUnit 5](https://junit.org/junit5/) | Unit testing | 5.10.2 |
| [Testcontainers](https://www.testcontainers.org/) | PostgreSQL integration tests | 1.19.7 |
| [Mockito](https://site.mockito.org/) | Mocking framework | 5.10.0 |

---

## 📌 Features
- **User Authentication:** Register/login with JWT tokens.
- **Handshake Management:** Create, accept, reject, or complete handshakes.
- **Public Key Exchange:** Users can set/retrieve public keys.
- **CORS + CSRF Protection:** Secure against cross-origin attacks.
- **Centralized Error Handling:** Consistent error responses.

---

## 📚 API Documentation

### 🔐 Authentication (/auth)
| Endpoint | Method | Description | Request Body Example |
|----------|--------|-------------|-----------------------|
| /register | POST | Register a new user | `{ "email": "a@b.com", "username": "user", "password": "pass" }` |
| /login | POST | Login (returns JWT cookie + CSRF) | `{ "username": "user", "password": "pass" }` |

### 🤝 Handshake Management (/handshake)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /create-handshake | POST | Initiate a handshake |
| /accept-handshake?name={name} | PUT | Accept a handshake |

### 👤 User Management (/users)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /me | GET | Get current user’s details |
| /me/setPublicKey | POST | Set user’s public key |

**Response Format:**
```json
{
  "success": true,
  "message": "Handshake created",
  "data": { ... }
}
```

---

## 🔐 Security

### JWT Flow
- **Login:** Validates credentials → returns JWT in a secure HttpOnly cookie.
- **Subsequent Requests:** Client sends JWT via `Authorization: Bearer <token>` or cookie.

### CSRF Protection
- CSRF token sent as a cookie (`XSRF-TOKEN`).
- Required for state-changing requests (POST/PUT/DELETE).

### CORS
Allowed origins:
- https://handshakr.duckdns.org
- http://localhost:3000

---

## 🚨 Exception Handling

Standardized error responses with HTTP status codes:

| Status Code | Example Scenarios |
|-------------|-------------------|
| 400 | Invalid input, validation failures |
| 401 | Invalid JWT or credentials |
| 404 | User/handshake not found |
| 409 | Duplicate username/handshake |
| 503 | Database/service unavailable |

**Example Error Response:**
```json
{
  "success": false,
  "message": "Username already exists",
  "status": 409
}
```

---

## ⚙️ Setup & Deployment

### Prerequisites
- Java 21  
- PostgreSQL 15+  
- Maven

### Configure Database
Update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://your-host:5432/your-db
spring.datasource.username=your-user
spring.datasource.password=your-pass
```

### Run Locally
```bash
mvn spring-boot:run
```

### Environment Variables
Set the following:
- `jwt.secret-key` (base64-encoded HMAC-SHA256 key)

---

## ✅ Testing

### Integration Tests
- Uses **Testcontainers** for PostgreSQL.

### Unit Tests
- **MockMVC** for controllers
- **JUnit 5** for services

### Run Tests
```bash
mvn test
```

---

## 📄 License
MIT © 2025 Handshakr Team
