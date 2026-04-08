const { parse } = require('csv-parse/sync');
const fs = require('fs');
const pool = require('../database');
const { analyzeTransaction } = require('../services/anomalyEngine');

// GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const statusFilter = req.query.status;
        let query = "SELECT * FROM transactions ORDER BY id DESC LIMIT 1000";
        let params = [];

        if (statusFilter) {
            query = "SELECT * FROM transactions WHERE investigation_status = $1 ORDER BY id DESC LIMIT 1000";
            params = [statusFilter];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /api/stats
const getStats = async (req, res) => {
    try {
        const totalResult = await pool.query("SELECT COUNT(*) FROM transactions");
        const anomaliesResult = await pool.query("SELECT COUNT(*) FROM transactions WHERE is_anomaly = true");
        const pendingResult = await pool.query("SELECT COUNT(*) FROM transactions WHERE investigation_status = 'pending'");

        res.json({
            totalTransactions: parseInt(totalResult.rows[0].count, 10),
            totalAnomalies: parseInt(anomaliesResult.rows[0].count, 10),
            pendingCases: parseInt(pendingResult.rows[0].count, 10)
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// PUT /api/transactions/:id/status
const updateTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['pending', 'cleared', 'fraud'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const query = `
            UPDATE transactions 
            SET investigation_status = $1, notes = $2 
            WHERE id = $3
        `;
        
        const result = await pool.query(query, [status, notes || '', id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /api/upload
const uploadTransactions = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No CSV file provided" });
        }

        // Read CSV file
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        fs.unlinkSync(req.file.path); // clean up uploaded file

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        const insertQuery = `
            INSERT INTO transactions (
                transaction_date, account_id, target_account_id, amount, currency, 
                transaction_type, is_anomaly, anomaly_reason, investigation_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const tx of records) {
                const amount = parseFloat(tx.amount) || 0;
                const { isAnomaly, reason } = analyzeTransaction({
                    amount, transaction_type: tx.transaction_type
                });

                await client.query(insertQuery, [
                    tx.date || new Date().toISOString(),
                    tx.account_id || '',
                    tx.target_account_id || '',
                    amount,
                    tx.currency || 'USD',
                    tx.transaction_type || 'transfer',
                    isAnomaly,
                    reason || '',
                    isAnomaly ? 'pending' : 'cleared'
                ]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        res.json({ success: true, message: `Successfully ingested ${records.length} records` });

    } catch (error) {
        console.error("Error processing CSV:", error);
        res.status(500).json({ error: "Failed to process CSV data" });
    }
};

// DELETE /api/transactions
const clearTransactions = async (req, res) => {
    try {
        await pool.query("TRUNCATE TABLE transactions RESTART IDENTITY CASCADE");
        res.json({ success: true, message: `Cleared transactions.` });
    } catch (error) {
        console.error("Error clearing transactions:", error);
        res.status(500).json({ error: "Failed to clear transactions" });
    }
};

module.exports = {
    getTransactions,
    getStats,
    updateTransactionStatus,
    uploadTransactions,
    clearTransactions
};
