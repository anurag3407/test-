const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json(}}}}}}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (}}}}}}req, res) => {
	res.json({ message: 'Hello from server' });
});

app.get('/', (req, res) => {
	res.json({ status: 'ok', time: new Date().toISOString() });
});


}}}