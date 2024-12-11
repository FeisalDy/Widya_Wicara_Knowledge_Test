# API Documentation

This API provides endpoints for managing products and user accounts, including authentication and CRUD operations.

## Base URL

```
http://<your-domain>
```

---

## Authentication Middleware

* **Authenticate**: Middleware applied to secured routes to validate JWT tokens. Include the token in the `Authorization` header.
  Example:
  ```
  Authorization: Bearer <token>
  ```

---

## User API

**Base Route:**`/api/user`

### 1. Register User

**POST** `/register`

**Request Body:**

```
{
  "name": "string",
  "email": "string",
  "password": "string",
  "gender": "string"
}
```

**Responses:**

* `200`: Account created successfully.
* `400`: Email already exists.
* `500`: Server error.

### 2. Login User

**POST** `/login`

**Request Body:**

```
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

* `200`: Login successful (returns JWT token).
* `401`: Invalid credentials.
* `500`: Server error.

### 3. Get Profile

**GET** `/profile`

**Headers:**

* Authorization: Bearer

**Responses:**

* `200`: Returns user profile data.
* `400`: User ID is required.
* `404`: User not found.
* `500`: Server error.

### 4. Update Profile

**PUT** `/profile`

**Headers:**

* Authorization: Bearer

**Request Body:**

```
{
  "name": "string",
  "email": "string",
  "gender": "string"
}
```

**Responses:**

* `200`: User updated successfully.
* `400`: Email already exists.
* `500`: Server error.

---

## Product API

**Base Route:**`/api/product`

### 1. Create Product

**POST** `/create`

**Headers:**

* Authorization: Bearer

**Request Body:**

```
{
  "name": "string",
  "price": "number",
  "category": "string",
  "description": "string"
}
```

**Responses:**

* `200`: Product created successfully.
* `400`: Missing required fields.
* `500`: Server error.

### 2. Get Products

**GET** `/`

**Headers:**

* Authorization: Bearer

**Query Parameters:**

* `page` (optional, default: 1): Current page.
* `limit` (optional, default: 10): Number of items per page.

**Responses:**

* `200`: List of products with pagination.
* `500`: Server error.

### 3. Get Product by ID

**GET** `/:id`

**Headers:**

* Authorization: Bearer

**Path Parameters:**

* `id`: Product ID.

**Responses:**

* `200`: Product data.
* `404`: Product not found.
* `500`: Server error.

### 4. Update Product

**PUT** `/update</span>`

**Headers:**

* Authorization: Bearer

**Request Body:**

```
{
  "id": "string",
  "name": "string",
  "price": "number",
  "category": "string",
  "description": "string"
}
```

**Responses:**

* `200`: Product updated successfully.
* `400`: Missing required fields.
* `500`: Server error.

### 5. Delete Product

**DELETE** `/delete`

**Headers:**

* Authorization: Bearer

**Request Body:**

```
{
  "id": "string"
}
```

**Responses:**

* `200`: Product deleted successfully.
* `500`: Server error.

---

## Error Codes

* `400`: Bad Request
* `401`: Unauthorized
* `404`: Not Found
* `500`: Internal Server Error
