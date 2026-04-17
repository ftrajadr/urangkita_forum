import app from './src/app.js';
import dotenv from 'dotenv';
import './src/config/db.js'

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    Server Running Succesfully
    Mode: ${process.env.NODE_ENV}
    PORT: ${PORT}
    `);
});
