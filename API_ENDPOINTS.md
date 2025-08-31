# API Endpoints per Dashboard Admin

Questo documento descrive tutti gli endpoint API che il backend deve implementare per supportare la dashboard admin completa.

## Autenticazione

### POST /api/auth/login
**Descrizione:** Login utente
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "accessToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user" | "admin"
  }
}
```

### GET /api/auth/verify
**Descrizione:** Verifica token di autenticazione
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user" | "admin"
  }
}
```

## Gestione Tours

### GET /api/tours
**Descrizione:** Ottieni tutti i tours
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "duration": "number",
    "price": "number",
    "maxParticipants": "number",
    "status": "active" | "inactive",
    "imageUrl": "string",
    "category": "string"
  }
]
```

### POST /api/tours
**Descrizione:** Crea un nuovo tour
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "title": "string",
  "description": "string",
  "duration": "number",
  "price": "number",
  "maxParticipants": "number",
  "status": "active" | "inactive",
  "imageUrl": "string",
  "category": "string"
}
```

### PUT /api/tours/:id
**Descrizione:** Aggiorna un tour esistente
**Headers:** `Authorization: Bearer <token>`
**Body:** Stesso formato di POST

### DELETE /api/tours/:id
**Descrizione:** Elimina un tour
**Headers:** `Authorization: Bearer <token>`

## Gestione Prenotazioni

### GET /api/bookings
**Descrizione:** Ottieni tutte le prenotazioni
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "tourId": "string",
    "tourTitle": "string",
    "userName": "string",
    "userEmail": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM)",
    "participants": "number",
    "status": "confirmed" | "pending" | "cancelled" | "completed",
    "totalPrice": "number",
    "notes": "string"
  }
]
```

### POST /api/bookings
**Descrizione:** Crea una nuova prenotazione
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "userId": "string",
  "tourId": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "participants": "number",
  "status": "confirmed" | "pending" | "cancelled" | "completed",
  "notes": "string"
}
```

### PUT /api/bookings/:id
**Descrizione:** Aggiorna una prenotazione esistente
**Headers:** `Authorization: Bearer <token>`
**Body:** Stesso formato di POST

### DELETE /api/bookings/:id
**Descrizione:** Elimina una prenotazione
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/bookings/:id/status
**Descrizione:** Aggiorna solo lo stato di una prenotazione
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "status": "confirmed" | "pending" | "cancelled" | "completed"
}
```

## Gestione Dispositivi

### GET /api/devices
**Descrizione:** Ottieni tutti i dispositivi
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "type": "headset" | "controller" | "sensor" | "pc",
    "model": "string",
    "serialNumber": "string",
    "status": "online" | "offline" | "maintenance",
    "availability": "available" | "occupied" | "reserved",
    "location": "string",
    "lastMaintenance": "string (YYYY-MM-DD)",
    "notes": "string",
    "ipAddress": "string",
    "batteryLevel": "number (0-100)"
  }
]
```

### POST /api/devices
**Descrizione:** Crea un nuovo dispositivo
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "string",
  "type": "headset" | "controller" | "sensor" | "pc",
  "model": "string",
  "serialNumber": "string",
  "status": "online" | "offline" | "maintenance",
  "availability": "available" | "occupied" | "reserved",
  "location": "string",
  "lastMaintenance": "string (YYYY-MM-DD)",
  "notes": "string",
  "ipAddress": "string",
  "batteryLevel": "number (0-100)"
}
```

### PUT /api/devices/:id
**Descrizione:** Aggiorna un dispositivo esistente
**Headers:** `Authorization: Bearer <token>`
**Body:** Stesso formato di POST

### DELETE /api/devices/:id
**Descrizione:** Elimina un dispositivo
**Headers:** `Authorization: Bearer <token>`

### PATCH /api/devices/:id/status
**Descrizione:** Aggiorna solo lo stato di un dispositivo
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "status": "online" | "offline" | "maintenance"
}
```

### PATCH /api/devices/:id/availability
**Descrizione:** Aggiorna solo la disponibilità di un dispositivo
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "availability": "available" | "occupied" | "reserved"
}
```

## Codici di Risposta

- **200:** Operazione completata con successo
- **201:** Risorsa creata con successo
- **400:** Richiesta non valida
- **401:** Non autorizzato (token mancante o non valido)
- **403:** Accesso negato (permessi insufficienti)
- **404:** Risorsa non trovata
- **500:** Errore interno del server

## Note per l'Implementazione

1. **Autenticazione:** Tutti gli endpoint (tranne login e register) richiedono un token JWT valido nell'header `Authorization: Bearer <token>`

2. **Autorizzazione:** Gli endpoint admin dovrebbero verificare che l'utente abbia il ruolo `admin`

3. **Validazione:** Implementare validazione dei dati in ingresso per tutti gli endpoint

4. **Gestione Errori:** Restituire messaggi di errore chiari e informativi

5. **CORS:** Configurare CORS per permettere le richieste dal frontend

6. **Rate Limiting:** Considerare l'implementazione di rate limiting per prevenire abusi

## Esempio di Implementazione Backend

Il backend dovrebbe essere implementato con:
- **Framework:** Express.js, Fastify, o simile
- **Database:** PostgreSQL, MySQL, MongoDB, o simile
- **Autenticazione:** JWT
- **Validazione:** Joi, Yup, o simile
- **ORM:** Prisma, TypeORM, Sequelize, o simile
