import express from 'express';
// import { getDb } from './src/db/connect.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).json ({ message: 'Server is running' });
});

// /* // app.get('/trails', async (req, res) => {
// //     try {
// //         const trails = await getDb().collection('trails').find().toArray();
// //         return res.status(200).json(trails);
// //     } catch (error) {
// //         console.error('Error fetching trails:', error);
// //         return res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // }); */

export default app;