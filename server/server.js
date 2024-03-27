const express = require('express');
const app = express();
const port = 5430;

// Basic route for testing
app.post('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
