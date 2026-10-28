import app from './app.js';

const PORT = process.env.PORT || 3000;

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
