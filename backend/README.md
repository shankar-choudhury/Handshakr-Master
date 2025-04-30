# Handshakr Prototype (Backend)

Please visit [https://handshakr.duckdns.org](https://handshakr.duckdns.org) to interact with the deployed application.

## 🛠 Tech Stack
**Backend:** Spring Boot 3.4.3 (Java 21)  
**Database:** PostgreSQL  
**Security:** JWT, PBKDF2 password encoding, CSRF tokens  
**Testing:** Testcontainers, JUnit 5  
**Tools:** Lombok, Hibernate Validator

---

## 📌 Features
- **User Authentication:** Register/login with JWT tokens.
- **Handshake Management:** Create, accept, reject, or complete handshakes.
- **Public Key Exchange:** Users can set/retrieve public keys.
- **CORS + CSRF Protection:** Secure against cross-origin attacks.
- **Centralized Error Handling:** Consistent error responses.

---

## 📚 API Documentation

### 🔐 Authentication (`/auth`)
| Endpoint | Method | Description | Request Body Example |
|----------|--------|-------------|-----------------------|
| `/register` | POST | Register a new user | `{ "email": "a@b.com", "username": "user", "password": "pass" }` |
| `/login` | POST | Login (returns JWT cookie + CSRF) | `{ "username": "user", "password": "pass" }` |

### 🤝 Handshake Management (`/handshake`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create-handshake` | POST | Initiate a handshake |
| `/accept-handshake?name={name}` | PUT | Accept a handshake |

### 👤 User Management (`/users`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/me` | GET | Get current user’s details |
| `/me/setPublicKey` | POST | Set user’s public key |

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
- `https://handshakr.duckdns.org`
- `http://localhost:3000`

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

### Documentation
Copy contents of target/reports/apidocs/allclasses-index.html and open in web browser to view dodumentation of web server

---

## 📄 License
MIT © 2025 Handshakr Team
