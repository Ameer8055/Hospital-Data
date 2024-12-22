const express = require('express');
const bodyParser = require('body-parser');
const hospitalRoutes = require('./Routes/BasicRoute');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/hospitals', hospitalRoutes); // Use the hospital routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});