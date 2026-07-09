const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tournament-data.json');
const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(express.static(__dirname));

/**
 * FIXED: Added check to see if file exists before reading
 * Reads tournament data from the JSON file.
 * If the file doesn't exist or is empty, returns an empty object.
 */
app.get('/api/get-data', async (req, res) => {
    try {
        if (BIN_ID && API_KEY) {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: { 'X-Master-Key': API_KEY }
            });
            if (!response.ok) throw new Error('Failed to fetch from JSONBin');
            const data = await response.json();
            return res.json(data.record || {});
        }

        // Check if the file exists first to prevent the 'no such file' error
        try {
            await fs.access(DATA_FILE);
        } catch {
            // If file doesn't exist, return an empty object or default structure
            return res.json({}); 
        }

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

app.post('/api/save-data', async (req, res) => {
    try {
        const newData = req.body;

        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ message: 'Invalid data provided.' });
        }

        if (BIN_ID && API_KEY) {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                },
                body: JSON.stringify(newData),
            });
            if (!response.ok) throw new Error('Failed to save data to JSONBin');
            return res.status(200).json({ message: 'Data saved successfully to cloud.' });
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
        res.status(200).json({ message: 'Data saved successfully.' });
    } catch (error) {
        console.error('Error writing data file:', error);
        res.status(500).json({ message: 'Error saving data.' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
