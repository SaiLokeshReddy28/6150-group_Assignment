import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finsight API Documentation",
      version: "1.0.0",
      description:
        "Personal Finance Management API - Track budgets, upload statements, get AI-powered insights, and manage admin access. Built with Express, MongoDB, and JWT authentication.",
      contact: {
        name: "Finsight Team",
        email: "support@finsight.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5001",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token from login/register. Format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              enum: ["mr", "ms", "mrs", "dr", "prof"],
              description: "User title",
              example: "mr",
            },
            name: {
              type: "string",
              description: "User full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "1234567890",
            },
            countryCode: {
              type: "string",
              description: "Country code for phone",
              example: "+1",
            },
            age: {
              type: "integer",
              description: "User age",
              example: 30,
            },
            gender: {
              type: "string",
              enum: ["male", "female", "other", "prefer-not-to-say"],
              description: "User gender",
              example: "male",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
              example: "user",
            },
            isActive: {
              type: "boolean",
              description: "Account active status",
              example: true,
            },
            isAdminRequested: {
              type: "boolean",
              description: "Whether user requested admin access",
              example: false,
            },
            googlePhoto: {
              type: "string",
              description: "Google profile photo URL (for OAuth users)",
              example: "https://lh3.googleusercontent.com/...",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Transaction ID",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              description: "User who owns this transaction",
              example: "507f1f77bcf86cd799439011",
            },
            uploadId: {
              type: "string",
              description: "Upload this transaction came from",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date",
              description: "Transaction date",
              example: "2024-01-15",
            },
            description: {
              type: "string",
              description: "Transaction description",
              example: "Grocery Store Purchase",
            },
            amount: {
              type: "number",
              description: "Transaction amount",
              example: 45.99,
            },
            category: {
              type: "string",
              description: "Transaction category",
              example: "Food & Dining",
            },
            type: {
              type: "string",
              enum: ["debit", "credit"],
              description: "Transaction type",
              example: "debit",
            },
            balance: {
              type: "number",
              description: "Account balance after transaction",
              example: 1234.56,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Upload: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Upload ID",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              description: "User who uploaded this file",
              example: "507f1f77bcf86cd799439011",
            },
            fileName: {
              type: "string",
              description: "Stored file name",
              example: "statement_jan_2024.pdf",
            },
            originalName: {
              type: "string",
              description: "Original file name",
              example: "Bank_Statement_January.pdf",
            },
            uploadDate: {
              type: "string",
              format: "date-time",
              description: "Upload timestamp",
            },
            status: {
              type: "string",
              enum: ["processing", "completed", "failed"],
              description: "Processing status",
              example: "completed",
            },
            transactionCount: {
              type: "integer",
              description: "Number of transactions extracted",
              example: 42,
            },
            fileSize: {
              type: "integer",
              description: "File size in bytes",
              example: 1048576,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "An error occurred",
            },
            errors: {
              type: "array",
              description: "Validation errors (if applicable)",
              items: {
                type: "object",
                properties: {
                  msg: {
                    type: "string",
                    example: "Invalid email format",
                  },
                  param: {
                    type: "string",
                    example: "email",
                  },
                  location: {
                    type: "string",
                    example: "body",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              examples: {
                noToken: {
                  summary: "No token provided",
                  value: {
                    message: "No token provided",
                  },
                },
                invalidToken: {
                  summary: "Invalid or expired token",
                  value: {
                    message: "Invalid or expired token",
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "Access denied - insufficient permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              examples: {
                adminRequired: {
                  summary: "Admin access required",
                  value: {
                    message: "Admin access required",
                  },
                },
                inactiveAccount: {
                  summary: "Account is inactive",
                  value: {
                    message: "Inactive account",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              examples: {
                userNotFound: {
                  summary: "User not found",
                  value: {
                    message: "User not found",
                  },
                },
                uploadNotFound: {
                  summary: "Upload not found",
                  value: {
                    message: "Upload not found",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                errors: [
                  {
                    msg: "Invalid email format",
                    param: "email",
                    location: "body",
                  },
                  {
                    msg: "Password must be at least 8 characters",
                    param: "password",
                    location: "body",
                  },
                ],
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                message: "Server error occurred",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description:
          "User authentication, registration, and Google OAuth endpoints. Includes JWT token generation and validation.",
      },
      {
        name: "Admin",
        description:
          "Admin management endpoints - requires admin role. Manage user permissions and view system statistics.",
      },
      {
        name: "Transactions",
        description:
          "Transaction management endpoints. View, filter, and analyze financial transactions extracted from uploaded statements.",
      },
      {
        name: "Uploads",
        description:
          "Document upload and parsing endpoints. Upload PDF bank statements and extract transactions using AI.",
      },
      {
        name: "Health",
        description: "Health check and status endpoints for monitoring API availability.",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/index.js"], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;