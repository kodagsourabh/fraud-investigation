const fs = require('fs');

const NUM_RECORDS = 50;
const accounts = ['ACC-1001', 'ACC-2022', 'ACC-3045', 'ACC-9999'];

console.log('date,account_id,target_account_id,amount,currency,transaction_type');
for (let i = 0; i < NUM_RECORDS; i++) {
    const isAnomaly = Math.random() > 0.85;
    
    let amount;
    if (isAnomaly) {
        // High chance of being an anomaly amount (either > 10,000 or close to 10k)
        amount = Math.random() > 0.5 ? (10000 + Math.random() * 50000).toFixed(2) : (9500 + Math.random() * 499).toFixed(2);
    } else {
        // Normal transaction
        amount = (Math.random() * 5000).toFixed(2);
    }

    const date = new Date(Date.now() - Math.random() * 10000000000).toISOString();
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const target = accounts[Math.floor(Math.random() * accounts.length)];
    const type = 'transfer';

    console.log(`${date},${account},${target},${amount},USD,${type}`);
}
