const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'tournament-data.json');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Check if the file exists first
        try {
            await fs.access(DATA_FILE);
        } catch {
            return res.json({});
        }

        const data = await fs.readFile(DATA_FILE, 'utf8');
        if (!data) {
            return res.json({});
        }
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.json({});
        }
        console.error('Error reading data file:', error);
        res.status(500).json({ message: 'Error retrieving data.' });
    }
}