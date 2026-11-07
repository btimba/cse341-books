import express from 'express';
import router from './src/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with {type: 'json'};


const app = express();
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: ['request body must contain valid JSON'],
        });
    }
    return next(error);
});
app.use(router);


app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});


export default app;