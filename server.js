import app from './app.js';
import connectToDb from './src/db/connect.js';

const PORT = process.env.PORT || 3000;

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);}
  };

await startServer();
