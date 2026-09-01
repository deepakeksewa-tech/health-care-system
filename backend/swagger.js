import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor Consultancy API",
      version: "1.0.0",
      description: "API documentation for Doctor Consultancy MERN Project",
    },
    servers: [
      {
        url: ["http://localhost:8000","https://health-care-system-vv00.onrender.com"],
      },
    ],
  },
  apis: ["./routes/*.js"], // Change according to your project structure
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;