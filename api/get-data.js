const BIN_ID = 'YOUR_JSONBIN_BIN_ID'; // Replace with your JSONBin bin ID
const API_KEY = 'YOUR_JSONBIN_API_KEY'; // Replace with your JSONBin API key

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            headers: {
                'X-Master-Key': API_KEY,
            },
        });
        if (!response.ok) {
            return res.json({});
        }
        const data = await response.json();
        res.json(data.record || {});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.json({});
    }
}