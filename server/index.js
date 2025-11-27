const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/time', (req, res) => {
  res.json({ now: Date.now() });
});

let messages = [];

app.post('/api/message', (req, res) => {
  const message = {
    id: Date.now(),
    data: req.body,
    timestamp: new Date().toISOString()
  };
  messages.push(message);
  res.json({ success: true, message });
});

app.get('/api/messages', (req, res) => {
  res.json({ messages });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
