Integrate your front-end or back-end application with the **BPMN Runner API** through the main endpoint:

```
POST /api/script/execute
```

This endpoint receives a **plain-text BPMN Runner script** and returns a **BPMN XML** document.

---

## 1 · Authentication

Each request must include a valid **API Key** and a registered **Origin**.

| Header | Description | Example |
|---------|--------------|---------|
| `X-Api-Key` | Integration key created in BPMN Runner | `74436740-fd4c-4370-9346-d68fa4ad6dc6-bf3ef006` |
| `Origin` | Domain registered for the key | `https://myapplication.com` |

> The origin must match exactly—no trailing `/`, correct protocol, exact host.

---

## 2 · Endpoint `/api/script/execute`

**Method:** `POST`  **Content-Type:** `text/plain`  **Response:** `application/xml`

**URL**
```
https://api.bpmn-runner.app/api/script/execute
```

### Headers
```http
Content-Type: text/plain
X-Api-Key: <your_api_key>
Origin: <your_origin>
```

### Body (plain text)
```
pool(p1, "Pool test") {
    process(pc1, "Process test") {
        start(s1);
        task(t1, "Manual test", MANUAL);
        end(e1);
    }
}
```

---

## 3 · Error Responses

| Status | Message | Cause |
|---------|----------|-------|
| 401 | Missing API Key | `X-Api-Key` header absent |
| 403 | Invalid origin | Origin not registered for the key |
| 403 | Invalid or expired key | Key is invalid or expired |
| 419 | Key expired | Key past expiration date |
| 400 | Invalid script | Syntax error in BPMN Runner DSL |

---

## 4 · Renewing API Keys `/api/keys/renew`

Renew an expired key:

```http
POST /api/keys/renew
Content-Type: application/json
X-Api-Key: <expired_key>
Origin: <your_origin>
```

**Response**
```json
{
  "keyId": "f58c1de1-5f3e-422a-8d02-16d0f8e444be",
  "key": "b3f4e231-829a-4a97-bb83-ef5b12b2b098",
  "createdAt": "2025-10-26T14:33:52Z",
  "expiresAt": "2025-11-26T14:33:52Z",
  "allowedOrigins": ["https://myapplication.com"]
}
```

---

## 5 · CORS and Trusted Origins

Dynamic CORS validation is applied.  
Requests must include an `Origin` header matching one of the key’s `allowedOrigins`.

| Environment | Allowed Origin |
|--------------|----------------|
| Production | `https://bpmn-runner.dev` |
| Development | `http://localhost:4200` |

If the origin does not match, the server omits `Access-Control-Allow-Origin`, and browsers block the call.

---

## 6 · Testing with Bruno or Postman

| Setting | Value |
|----------|--------|
| Method | POST |
| URL | `https://api.bpmn-runner.app/api/script/execute` |
| Headers | `Content-Type: text/plain`, `X-Api-Key: <your_key>`, `Origin: https://myapplication.com` |
| Body | Plain-text script |

Expected response: `200 OK`, `Content-Type: application/xml`, BPMN XML body.

---

## 7 · Health Check (no auth)

```
GET /api/actuator/health
```

Response:
```json
{ "status": "UP" }
```

---

## 8 · Common Issues

| Problem | Cause | Fix |
|----------|--------|-----|
| CORS error | Origin not registered or trailing slash | Register exact origin (no `/`) |
| 403 | Invalid / expired key | Renew via `/api/keys/renew` |
| 401 | Missing header | Add `X-Api-Key` |
| 419 | Expired key | Renew key |
| 400 | Invalid script | Check DSL syntax |

---

## 9 · Summary

| Endpoint | Method | Description | Auth |
|-----------|---------|-------------|------|
| `/api/script/execute` | POST | Execute BPMN Runner script (plain text → XML) | ✅ API Key |
| `/api/keys/renew` | POST | Renew expired key | ✅ API Key |
| `/api/actuator/health` | GET | Health check | ❌ |

---

© 2025 BPMN Runner API – Matheus Filipe Freitas  
_Last updated 2025-11-20_
