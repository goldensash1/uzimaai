# UzimaAI PHP API Endpoints

This document describes all available API endpoints in the `api/endpoints/` directory. Use this as a reference for testing with Postman or integrating with the frontend.

---

## Base URL

```
http://localhost/uzimaai/api/endpoints
```

---

## 1. Authentication

### Register
- **POST** `/register.php`
- **Body (JSON):**
  ```json
  {
    "username": "string",
    "useremail": "string",
    "phone": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  ```json
  { "success": true, "userid": 1 }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 409: `{ "error": "User already exists" }`

### Login
- **POST** `/login.php`
- **Body (JSON):**
  ```json
  {
    "identifier": "string", // email or phone
    "password": "string"
  }
  ```
- **Success Response:**
  ```json
  { "success": true, "user": { "userid": 1, "username": "...", "useremail": "...", "phone": "...", "userstatus": "active" } }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 401: `{ "error": "Invalid credentials" }`

---

## 2. User Profile

### Get Profile
- **GET** `/profile.php?userid=USER_ID`
- **Success Response:**
  ```json
  { "success": true, "user": { "userid": 1, "username": "...", "useremail": "...", "phone": "...", "emergencyphone": "...", "userstatus": "active" } }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing userid" }`
  - 404: `{ "error": "User not found" }`

### Update Profile
- **POST** `/update_profile.php`
- **Body (JSON):**
  ```json
  {
    "userid": 1,
    "username": "string",
    "useremail": "string",
    "phone": "string",
    "emergencyphone": "string" // optional
  }
  ```
- **Success Response:**
  ```json
  { "success": true }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to update profile" }`

---

## 3. Medicines

### Get Medicines
- **GET** `/medicines.php`
- **Success Response:**
  ```json
  { "success": true, "medicines": [ { "medicineId": 1, "medicineName": "...", "medicineUses": "...", "medicineSideEffects": "...", "medicineAlternatives": "...", "medicineStatus": 1, "updatedDate": "..." }, ... ] }
  ```

---

## 4. Medicine Reviews

### Add Medicine Review
- **POST** `/add_medicine_review.php`
- **Body (JSON):**
  ```json
  {
    "UserId": 1,
    "medicineId": 1,
    "ReviewMessage": "string",
    "rating": 5
  }
  ```
- **Success Response:**
  ```json
  { "success": true, "riviewId": 1 }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to add review" }`

### Get Medicine Reviews
- **GET** `/get_medicine_reviews.php?medicineId=1`
- **Success Response:**
  ```json
  { "success": true, "reviews": [ { "riviewId": 1, "UserId": 1, "username": "...", "ReviewMessage": "...", "rating": 5, "reviewDate": "..." }, ... ] }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing medicineId" }`

---

## 5. Chat (User Context)

### Send Message
- **POST** `/send_message.php`
- **Body (JSON):**
  ```json
  {
    "userId": 1,
    "message": "string"
  }
  ```
- **Success Response:**
  ```json
  { "success": true, "contextId": 1 }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to save message" }`

### Get Chat History
- **GET** `/get_chat_history.php?userId=1`
- **Success Response:**
  ```json
  { "success": true, "messages": [ { "contextId": 1, "contextContent": "...", "contextTime": "..." }, ... ] }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing userId" }`

---

## 6. Search History

### Get Search History
- **GET** `/get_search_history.php?userid=1`
- **Success Response:**
  ```json
  { "success": true, "history": [ { "searchId": 1, "searchContent": "...", "searchTime": "..." }, ... ] }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing userid" }`

---

## 7. Emergency Contacts

### Get All Contacts
- **GET** `/emergency_contacts.php?UserId=1`
- **Success Response:**
  ```json
  { "success": true, "contacts": [ { "contactId": 1, "UserId": 1, "PhoneNumber": "...", "Relationship": "...", "ContactName": "...", "updatedDate": "...", "contactStatus": 1 }, ... ] }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing UserId" }`

### Add Contact
- **POST** `/add_emergency_contact.php`
- **Body (JSON):**
  ```json
  {
    "UserId": 1,
    "PhoneNumber": "string",
    "Relationship": "string",
    "ContactName": "string"
  }
  ```
- **Success Response:**
  ```json
  { "success": true, "contactId": 1 }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to add contact" }`

### Update Contact
- **POST** `/update_emergency_contact.php`
- **Body (JSON):**
  ```json
  {
    "contactId": 1,
    "PhoneNumber": "string",
    "Relationship": "string",
    "ContactName": "string"
  }
  ```
- **Success Response:**
  ```json
  { "success": true }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to update contact" }`

### Delete Contact
- **POST** `/delete_emergency_contact.php`
- **Body (JSON):**
  ```json
  {
    "contactId": 1
  }
  ```
- **Success Response:**
  ```json
  { "success": true }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing contactId" }`
  - 500: `{ "error": "Failed to delete contact" }`

### Set Primary Contact
- **POST** `/set_primary_emergency_contact.php`
- **Body (JSON):**
  ```json
  {
    "UserId": 1,
    "contactId": 1
  }
  ```
- **Success Response:**
  ```json
  { "success": true }
  ```
- **Error Responses:**
  - 400: `{ "error": "Missing required fields" }`
  - 500: `{ "error": "Failed to set primary contact" }`

---

## Notes
- All requests and responses are in JSON.
- For POST requests, set the `Content-Type: application/json` header in Postman.
- All endpoints return an `error` field with a message on failure. 