const BIN_ID = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const newData = req.body;

        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ message: 'Invalid data provided.' });
        }

        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
            body: JSON.stringify(newData),
        });

        if (!response.ok) {
            throw new Error('Failed to save data');
        }

        res.status(200).json({ message: 'Data saved successfully.' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data.' });
    }
}