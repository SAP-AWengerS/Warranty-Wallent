const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warranty Wallet API',
      version: '1.1.1',
      description: 'API documentation for Warranty Wallet - A comprehensive warranty management system',
      contact: {
        name: 'API Support',
        url: 'https://github.com/SAP-AWengerS/Warranty-Wallet'
      },
      license: {
        name: 'Licensed under MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://warranty-wallet-backend-1.onrender.com',
        description: 'Test server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['googleId', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
              example: '507f1f77bcf86cd799439011'
            },
            googleId: {
              type: 'string',
              description: 'Google OAuth ID',
              example: '1234567890'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        Warranty: {
          type: 'object',
          required: ['itemName', 'category', 'purchasedOn', 'expiresOn', 'addedBy'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
              example: '507f1f77bcf86cd799439011'
            },
            itemName: {
              type: 'string',
              description: 'Name of the item',
              example: 'iPhone 14 Pro'
            },
            category: {
              type: 'string',
              description: 'Category of the item',
              example: 'Electronics',
              enum: ['Electronics', 'Automotive', 'Home & Kitchen', 'Fashion', 'Sport', 'Kids & Toys', 'Phones']
            },
            warrantyProvider: {
              type: 'string',
              description: 'Name of the warranty provider',
              example: 'Apple Inc.'
            },
            purchasedOn: {
              type: 'string',
              format: 'date',
              description: 'Purchase date',
              example: '2024-01-15'
            },
            expiresOn: {
              type: 'string',
              format: 'date',
              description: 'Warranty expiry date',
              example: '2025-01-15'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Warranty record creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            },
            description: {
              type: 'string',
              description: 'Additional details about the warranty',
              example: 'One year manufacturer warranty covering hardware defects'
            },
            addedBy: {
              type: 'string',
              description: 'User ID who added this warranty',
              example: '507f1f77bcf86cd799439011'
            },
            invoiceURL: {
              type: 'string',
              format: 'uri',
              description: 'URL to the invoice/receipt',
              example: 'https://s3.amazonaws.com/bucket/invoice.pdf'
            },
            sharedWith: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of user IDs this warranty is shared with',
              example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
            }
          }
        },
        WarrantyStats: {
          type: 'object',
          properties: {
            totalWarranties: {
              type: 'integer',
              description: 'Total number of warranties',
              example: 25
            },
            activeWarranties: {
              type: 'integer',
              description: 'Number of active warranties',
              example: 20
            },
            expiredWarranties: {
              type: 'integer',
              description: 'Number of expired warranties',
              example: 5
            },
            expiringWarranties: {
              type: 'integer',
              description: 'Number of warranties expiring soon',
              example: 3
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message description'
            },
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User profile management endpoints'
      },
      {
        name: 'Warranties',
        description: 'Warranty CRUD operations and management'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints for user management'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Warranty Wallet API Docs'
  }));
};

module.exports = setupSwagger;
