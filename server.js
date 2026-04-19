const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tournament-data.json');

app.use(express.json());
app.use(express.static(__dirname));

/**
 * FIXED: Added check to see if file exists before reading
 */
app.get('/api/get-data', async (req, res) => {
    try {
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
<<<<<<< HEAD
        // For other errors (e.g., parsing malformed JSON), send a 500.
=======
>>>>>>> 706f294b8d681b5353b74a2b9d621c4bcb6b4377
        res.status(500).json({ message: 'Error retrieving data.' });
    }
});

app.post('/api/save-data', async (req, res) => {
    try {
        const newData = req.body;

        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ message: 'Invalid data provided.' });
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
        res.status(200).json({ message: 'Data saved successfully.' });
    } catch (error) {
        console.error('Error writing data file:', error);
        res.status(500).json({ message: 'Error saving data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
