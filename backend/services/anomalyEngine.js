/**
 * Analyzes a given transaction to determine if it is an anomaly.
 * Returns an object with { isAnomaly: boolean, reason: string | null }
 */
function analyzeTransaction(transaction) {
    const { amount, transaction_type } = transaction;
    let isAnomaly = false;
    let reason = null;
    const reasons = [];

    // Rule 1: High value transaction
    if (amount > 10000) {
        isAnomaly = true;
        reasons.push('Amount exceeds $10,000 threshold');
    }

    // Rule 2: Suspicious transfer amounts (e.g. just below the $10,000 reporting threshold)
    if (amount >= 9500 && amount <= 9999 && transaction_type === 'transfer') {
        isAnomaly = true;
        reasons.push('Transfer amount is suspiciously close to reporting threshold ($9,500 - $9,999)');
    }

    if (reasons.length > 0) {
        reason = reasons.join('; ');
    }

    return { isAnomaly, reason };
}

module.exports = {
    analyzeTransaction
};
