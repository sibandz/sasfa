const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tournament-data.json');

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static(__dirname)); // Serves files like index.html, edit.html, images, etc.

/**
 * API Endpoint to get tournament data.
 * Reads from tournament-data.json and sends it.
 */
app.get('/api/get-data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        // If the file is empty, it's not valid JSON. Return an empty object.
        if (!data) {
            return res.json({});
        }
        res.json(JSON.parse(data));
    } catch (error) {
        // If the file doesn't exist, it's not an error.
        // It just means no data has been saved yet. Send an empty object.
        if (error.code === 'ENOENT') {
            return res.json({});
        }
        console.error('Error reading data file:', error);
        // For other errors (e.g., parsing malformed JSON), send a 500.
        res.status(500).json({ message: 'Error retrieving data.' });
    }
});

/**
 * API Endpoint to save tournament data.
 * Receives data in the request body and writes it to tournament-data.json.
 */
app.post('/api/save-data', async (req, res) => {
    try {
        const newData = req.body;

        // Basic validation: check if the body is a non-empty object
        if (!newData || typeof newData !== 'object' || Object.keys(newData).length === 0) {
            return res.status(400).json({ message: 'Invalid data provided.' });
        }

        // Write the new data to the file, formatted for readability
        await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
        
        console.log('Data saved successfully.');
        res.status(200).json({ message: 'Data saved successfully.' });

    } catch (error) {
        console.error('Error writing data file:', error);
        res.status(500).json({ message: 'Error saving data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Serving files from:', __dirname);
    console.log('Data will be read from and written to:', DATA_FILE);
});