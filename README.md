# Blog API (Week 9)

A RESTful API for managing blog articles built with **Node.js**, **Express 5**, **MongoDB**, and **Mongoose**, featuring schema validation using **Joi**, pagination support, custom middleware logging, and automated database seeding.

---

## 🚀 Features

- **Full CRUD Functionality**: Create, read, update, and delete blog articles.
- **Pagination & Sorting**: Paginated article listings (`page` and `limit` query parameters) sorted by newest first.
- **Input Validation**: Request body validation using **Joi** schemas with informative validation error messages.
- **Middleware Integration**:
  - **Request Logger**: Logs incoming HTTP methods and endpoint paths.
  - **Centralized Error Handler**: Uniform JSON error responses across all controllers.
  - **CORS Support**: Cross-Origin Resource Sharing enabled for client integrations.
- **Database Seeding**: Ready-to-use seeding script to populate initial sample articles.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) (v9)
- **Validation**: [Joi](https://joi.dev/)
- **Configuration & Tools**: `dotenv`, `cors`, `nodemon`

---

## 📁 Project Structure

```text
week9-blog-api/
├── controllers/
│   └── article.controller.js   # Request handlers & Joi validation for articles
├── database/
│   └── connectDB.js            # MongoDB connection setup
├── middlewares/
│   ├── errorHandler.js         # Centralized error handling middleware
│   └── requestLogger.js        # Request logging middleware
├── models/
│   └── article.model.js        # Mongoose schema and model definition
├── routes/
│   └── article.route.js        # Express routes for article endpoints
├── seeds/
│   ├── articles.seed.json      # Sample seed data
│   └── seed.js                 # Database seeding script
├── .env                        # Environment variables (git-ignored)
├── .gitignore
├── index.js                    # Application entry point
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas cluster URI)

### Installation

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd week9-blog-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3200
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/blog-db?retryWrites=true&w=majority
   ```

---

## 🗄️ Database Seeding

To populate your database with initial sample articles:

```bash
npm run seed
```

> **Note:** Running this script clears the existing `articles` collection and inserts the sample articles defined in `seeds/articles.seed.json`.

---

## 🏃 Running the Application

- **Development Mode (with auto-reload via Nodemon):**
  ```bash
  npm run dev
  ```

- **Production Mode:**
  ```bash
  npm start
  ```

The server will start and listen on the configured port (e.g., `http://localhost:3200`).

---

## 📖 API Documentation

Base URL: `http://localhost:3200/api`

### 1. Create Article
Creates a new blog article.

- **Method**: `POST`
- **Endpoint**: `/articles`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Getting Started with Node.js and MongoDB",
    "content": "A comprehensive guide on building scalable REST APIs...",
    "author": "Joel"
  }
  ```
  *(Note: `author` is optional and defaults to `"Public"`)*

- **Validation Rules**:
  - `title`: String, required, 5–100 characters.
  - `content`: String, required, min 10 characters.
  - `author`: String, optional, defaults to `"Public"`.

- **Success Response (`201 Created`)**:
  ```json
  {
    "message": "Article created",
    "data": {
      "_id": "670123456789abcdef012345",
      "title": "Getting Started with Node.js and MongoDB",
      "content": "A comprehensive guide on building scalable REST APIs...",
      "author": "Joel",
      "createdAt": "2026-10-05T11:00:00.000Z",
      "updatedAt": "2026-10-05T11:00:00.000Z",
      "__v": 0
    }
  }
  ```

---

### 2. Get All Articles (Paginated)
Retrieves a paginated list of articles sorted by newest first.

- **Method**: `GET`
- **Endpoint**: `/articles`
- **Query Parameters**:
  - `page` *(optional, default: `1`)*: Page number.
  - `limit` *(optional, default: `10`)*: Items per page.
- **Example Request**:
  ```http
  GET /api/articles?page=1&limit=5
  ```
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "_id": "670123456789abcdef012345",
      "title": "Getting Started with Node.js and MongoDB",
      "content": "A comprehensive guide on building scalable REST APIs...",
      "author": "Joel",
      "createdAt": "2026-10-05T11:00:00.000Z",
      "updatedAt": "2026-10-05T11:00:00.000Z"
    }
  ]
  ```

---

### 3. Get Article by ID
Retrieves a specific article by its MongoDB `_id`.

- **Method**: `GET`
- **Endpoint**: `/articles/:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Article found",
    "data": {
      "_id": "670123456789abcdef012345",
      "title": "Getting Started with Node.js and MongoDB",
      "content": "A comprehensive guide on building scalable REST APIs...",
      "author": "Joel",
      "createdAt": "2026-10-05T11:00:00.000Z",
      "updatedAt": "2026-10-05T11:00:00.000Z"
    }
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "message": "Article with ID 670123456789abcdef012345 not found"
  }
  ```

---

### 4. Update Article by ID
Updates fields of an existing article.

- **Method**: `PUT`
- **Endpoint**: `/articles/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Updated Article Title",
    "content": "Updated content of the article...",
    "author": "Joel"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Article updated",
    "data": {
      "_id": "670123456789abcdef012345",
      "title": "Updated Article Title",
      "content": "Updated content of the article...",
      "author": "Joel",
      "createdAt": "2026-10-05T11:00:00.000Z",
      "updatedAt": "2026-10-05T11:30:00.000Z"
    }
  }
  ```

---

### 5. Delete Article by ID
Deletes an article from the database.

- **Method**: `DELETE`
- **Endpoint**: `/articles/:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "message": "Article Getting Started with Node.js and MongoDB deleted successfully.",
    "data": {
      "_id": "670123456789abcdef012345",
      "title": "Getting Started with Node.js and MongoDB",
      "content": "A comprehensive guide on building scalable REST APIs...",
      "author": "Joel"
    }
  }
  ```

---

## 🛡️ Error Handling

The API returns appropriate HTTP status codes along with descriptive error payloads:

| Status Code | Description | Example Response Body |
| :--- | :--- | :--- |
| `400 Bad Request` | Input validation failed | `{"error": "\"title\" length must be at least 5 characters long"}` |
| `404 Not Found` | Requested resource not found | `{"message": "Article with ID <id> not found"}` |
| `500 Internal Server Error` | Unhandled server error | `{"error": "Internal server error message"}` |

---

## 📜 Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `nodemon index.js` | Starts server in development mode with live reloading |
| `npm start` | `node index.js` | Starts the production server |
| `npm run seed` | `node seeds/seed.js` | Clears and seeds the MongoDB database with sample articles |

---

## 📄 License

This project is licensed under the [ISC License](package.json).