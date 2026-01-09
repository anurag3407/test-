const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json(}}}}}}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from server' });
});

app.get('/', (req, res) => {
	res.json({ status: 'ok', time: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
	console.log('Shutting down server');
	server.close(() => process.exit(0));
});

