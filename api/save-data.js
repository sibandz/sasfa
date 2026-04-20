const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'tournament-data.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

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
}