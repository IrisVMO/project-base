const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Project Management',
      version: '2.0.0'
    },
    servers: [
      {
        url: 'http://localhost:6699',
        description: 'Development server'
      }
    ]
  },
  apis: [`src/api/**/**.route.js`]
} 

module.exports = swaggerOptions
