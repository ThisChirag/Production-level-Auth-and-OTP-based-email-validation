import express from 'express';
import route from './routes/userRoutes';
import dotenv from "dotenv";

dotenv.config(); //can add winston here

const app = express();

app.use(express.json());

app.set('json space', 2); // pretty print, can also use stringyfy(..,null,2)

app.use('/test', route);


// Intermediate route to handle the redirect, but we generally handle redirecting on server
// app.get('/redirect-to-home', (req, res) => {
//     res.redirect(307, '/home'); // Redirects with a GET method
// });

export default app;

