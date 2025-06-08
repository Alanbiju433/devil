const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname));

const messagesFile = path.join(__dirname, 'messages.json');

// Endpoint to receive chat messages
app.post('/api/messages', (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Append message to messages.json file
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        let messages = [];
        if (!err && data) {
            try {
                messages = JSON.parse(data);
            } catch (e) {
                messages = [];
            }
        }
        messages.push({ message, timestamp: new Date().toISOString() });
        fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                console.error('Error writing messages file:', err);
                return res.status(500).json({ error: 'Failed to save message' });
            }
            res.json({ status: 'Message received' });
        });
    });
});

app.get('/api/messages', (req, res) => {
    fs.readFile(messagesFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, return empty array
                return res.json([]);
            }
            return res.status(500).json({ error: 'Failed to read messages' });
        }
        try {
            const messages = data ? JSON.parse(data) : [];
            res.json(messages);
        } catch (e) {
            res.status(500).json({ error: 'Invalid messages data' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
