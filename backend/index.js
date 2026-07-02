const express= require('express');
const app = express();
c




// Sample route
app.get('/', (req, res) => {
	res.send('Hello World!');
});




// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
// Additional routes and middleware can be added here;
app.get('/status', (rres) => {
	res.json({ status: 'Server is running smoothly!' });
	});

);


