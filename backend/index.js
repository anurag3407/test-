const express= require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());



// Sample route
app.get('/', (req, res) => {
	res.send('Hello World!');
});	

}}}
// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
// Additional routes and middleware can be added here
app.get('/status', (req, res) => {
	res.json({ status: 'Server is running smoothly!' });
}

);


