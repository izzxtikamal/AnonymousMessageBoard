// server.js
const express = require('express');
const app = express();

// Middleware and security features go here

// Define API routes
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
