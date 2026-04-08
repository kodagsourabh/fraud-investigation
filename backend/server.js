const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { 
    getTransactions, 
    getStats, 
    updateTransactionStatus,
    uploadTransactions,
    clearTransactions
} = require('./controllers/transactionsController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// API Routes
app.get('/api/transactions', getTransactions);
app.get('/api/stats', getStats);
app.put('/api/transactions/:id/status', updateTransactionStatus);
app.post('/api/upload', upload.single('csv'), uploadTransactions);
app.delete('/api/transactions', clearTransactions);

// Start server conditionally (for testing purposes)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app; // export for testing
