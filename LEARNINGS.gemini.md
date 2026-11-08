# Learnings & Patterns

### 1. File Uploads with Nodemon
- **Issue:** By default, `nodemon` watches all files and subdirectories. When uploaded files are saved to `uploads/`, nodemon interprets it as a source code change and restarts the entire Express app, disconnecting active client requests and reconnecting to MongoDB.
- **Solution:** Configure a `nodemon.json` with `"ignore": ["uploads/*", "node_modules/*"]`.

### 2. Multer Error Handling
- **Issue:** Multer errors (`LIMIT_FILE_SIZE`, `LIMIT_UNEXPECTED_FILE`) do not have an `err.status` property, so generic Express error handlers treat them as 500 Internal Server Errors.
- **Solution:** In `errorHandler.js`, check `err instanceof multer.MulterError` and map codes like `LIMIT_FILE_SIZE` and `LIMIT_UNEXPECTED_FILE` to `400 Bad Request`.

### 3. Middleware Ordering
- **Issue:** Routes registered before global middlewares like `cors()` and `RequestLogger` will bypass CORS headers and request logging.
- **Solution:** Always register `cors()`, `express.json()`, `express.urlencoded()`, static file serving (`/uploads`), and logger middlewares before mounting application routes.
