const request = require('supertest');
const app = require('../server');
const db = require('../database');

describe('Transactions API', () => {
    beforeAll(() => {
        db.exec("DELETE FROM transactions;"); // clean DB for tests
    });

    it('should return empty stats initially', async () => {
        const res = await request(app).get('/api/stats');
        expect(res.statusCode).toEqual(200);
        expect(res.body.totalTransactions).toEqual(0);
    });

    it('should upload CSV data successfully', async () => {
        const mockCSV = `date,account_id,target_account_id,amount,currency,transaction_type
2024-01-01T12:00:00Z,ACC-1,ACC-2,500.00,USD,transfer
2024-01-02T12:00:00Z,ACC-1,ACC-2,15000.00,USD,transfer
2024-01-03T12:00:00Z,ACC-3,ACC-4,9800.00,USD,transfer`;

        const res = await request(app)
            .post('/api/upload')
            .attach('csv', Buffer.from(mockCSV), 'test.csv');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    it('should have recorded stats properly', async () => {
        const res = await request(app).get('/api/stats');
        expect(res.statusCode).toEqual(200);
        expect(res.body.totalTransactions).toEqual(3);
        expect(res.body.totalAnomalies).toEqual(2); // 15k and 9800
        expect(res.body.pendingCases).toEqual(2); // Anomalies are marked pending
    });

    it('should successfully get transactions list', async () => {
        const res = await request(app).get('/api/transactions');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
    });
});
