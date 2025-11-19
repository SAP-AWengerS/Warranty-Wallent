# Swagger API Documentation

## Overview

The Warranty Wallet API is now fully documented using Swagger/OpenAPI 3.0 specification. This provides interactive API documentation that allows you to explore and test all available endpoints.

## Accessing the Documentation

Once the backend server is running, you can access the Swagger UI at:

```
http://localhost:3000/api-docs
```

For production environments, replace `localhost:3000` with your actual API domain.

## Features

### Interactive API Testing
- Test API endpoints directly from the browser
- View request/response schemas
- See example payloads and responses
- Try out authenticated endpoints with token authentication

### Comprehensive Documentation
- All endpoints are documented with descriptions
- Request parameters and body schemas
- Response codes and schemas
- Authentication requirements
- Example values for all fields

## API Endpoints Overview

### Authentication Endpoints (`/api/v1/app/auth`)
- **POST** `/signUp` - Register a new user
- **POST** `/logIn` - Login user with credentials
- **POST** `/logOut` - Logout current user
- **POST** `/whoami` - Get current user information
- **POST** `/signUpWithGoogle` - Sign up/login with Google OAuth

### User Endpoints (`/api/v1/app/users`)
- **GET** `/getMyProfile` - Get current user's profile (requires authentication)

### Warranty Endpoints (`/api/v1/app/warranty`)
- **POST** `/addWarranty` - Add a new warranty with optional invoice file upload
- **POST** `/uploadInvoice` - Upload invoice file to AWS S3
- **GET** `/getAllWarrantyByUser/:addedBy` - Get all warranties for a specific user
- **GET** `/getWarrantyById/:id` - Get warranty by ID
- **PUT** `/updateWarrantyById/:id` - Update warranty by ID
- **DELETE** `/deleteWarrantyById/:id` - Delete warranty by ID
- **GET** `/stats/:addedBy` - Get warranty statistics for a user
- **GET** `/getExpiringWarrantiesByUser/:addedBy` - Get warranties expiring soon
- **POST** `/shareAccess/:id` - Share warranty access with another user
- **DELETE** `/revokeAccess/:id` - Revoke warranty access from a user

### Admin Endpoints (`/api/v1/admin`)
- **GET** `/getAlluser` - Get all users (Admin only)
- **GET** `/getOneUserByUsername` - Get specific user by username (Admin only)
- **GET** `/deleteOneUserByUsername` - Delete user by username (Admin only)

## Authentication

The API supports two authentication methods:

### 1. Cookie Authentication
- Used for web applications
- Token is stored in HTTP-only cookie
- Automatically sent with requests

### 2. Bearer Token Authentication
- Used for API clients and mobile apps
- Include token in Authorization header:
  ```
  Authorization: Bearer <your-jwt-token>
  ```

## Using Swagger UI

### Testing Authenticated Endpoints

1. **Login First**: Use the `/api/v1/app/auth/logIn` or `/api/v1/app/auth/signUpWithGoogle` endpoint to get a token
2. **Authorize**: Click the "Authorize" button at the top of the Swagger UI
3. **Enter Token**: Paste your JWT token in the "bearerAuth" field
4. **Test Endpoints**: You can now test authenticated endpoints

### Testing File Uploads

For endpoints that accept file uploads (like `/addWarranty` and `/updateWarrantyById`):
1. Click "Try it out"
2. Fill in required fields
3. Click "Choose File" for the `invoiceFile` parameter
4. Select a file (max 5MB)
5. Click "Execute"

## Schema Definitions

### User Schema
```json
{
  "_id": "string",
  "googleId": "string",
  "email": "string",
  "name": "string",
  "createdAt": "date-time"
}
```

### Warranty Schema
```json
{
  "_id": "string",
  "itemName": "string",
  "category": "string",
  "warrantyProvider": "string",
  "purchasedOn": "date",
  "expiresOn": "date",
  "createdAt": "date-time",
  "description": "string",
  "addedBy": "string",
  "invoiceURL": "string",
  "sharedWith": ["string"]
}
```

### Warranty Statistics Schema
```json
{
  "totalWarranties": "integer",
  "activeWarranties": "integer",
  "expiredWarranties": "integer",
  "expiringWarranties": "integer"
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message description",
  "error": "Detailed error information"
}
```

## Common HTTP Status Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (invalid input)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Resource not found
- **409** - Conflict (e.g., user already exists)
- **500** - Internal server error

## Development

### Modifying Documentation

The API documentation is generated from JSDoc comments in the route files. To update documentation:

1. Edit the appropriate route file in `/backend/routes/`
2. Update the Swagger JSDoc comments above the route definition
3. Restart the server to see changes

### Swagger Configuration

The main Swagger configuration is located in `/backend/swagger.js`. This file contains:
- API metadata (title, version, description)
- Server configurations
- Security scheme definitions
- Reusable schema definitions
- Tag definitions

## Best Practices

### For API Consumers
1. Always include proper authentication tokens
2. Check response status codes before processing data
3. Handle errors appropriately
4. Respect rate limits (if implemented)
5. Use appropriate HTTP methods (GET for reading, POST for creating, PUT for updating, DELETE for removing)

### For API Developers
1. Keep JSDoc comments up to date with code changes
2. Provide clear descriptions for all parameters
3. Include example values
4. Document all possible response codes
5. Update schema definitions when models change

## Examples

### Example: Login Request
```bash
curl -X POST "http://localhost:3000/api/v1/app/auth/logIn" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Example: Get All Warranties
```bash
curl -X GET "http://localhost:3000/api/v1/app/warranty/getAllWarrantyByUser/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <your-token>"
```

### Example: Add New Warranty
```bash
curl -X POST "http://localhost:3000/api/v1/app/warranty/addWarranty" \
  -H "Authorization: Bearer <your-token>" \
  -F "itemName=iPhone 14 Pro" \
  -F "category=Electronics" \
  -F "purchasedOn=2024-01-15" \
  -F "expiresOn=2025-01-15" \
  -F "addedBy=507f1f77bcf86cd799439011" \
  -F "invoiceFile=@/path/to/invoice.pdf"
```

## Troubleshooting

### Swagger UI Not Loading
- Ensure the backend server is running
- Check that port 3000 is not blocked
- Verify `/api-docs` endpoint is accessible
- Check browser console for errors

### Authentication Issues
- Ensure token is valid and not expired
- Check token format (should be JWT)
- Verify token is included in Authorization header
- For cookie auth, ensure cookies are enabled

### File Upload Issues
- Check file size (max 5MB)
- Verify file format is supported
- Ensure multipart/form-data content type is used
- Check AWS S3 configuration if upload fails

## Support

For issues or questions regarding the API documentation:
- Check the main [README.md](../README.md)
- Review the [CONTRIBUTING.md](../CONTRIBUTING.md) guide
- Open an issue on the GitHub repository

## Version History

- **v1.1.1** - Initial Swagger documentation implementation
  - All endpoints documented
  - Interactive UI available
  - Schema definitions added
  - Authentication examples included
