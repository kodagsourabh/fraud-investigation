const API_URL = import.meta.env.VITE_API_URL || 'https://fraud-investigation.onrender.com/api';

export const api = {
    async getTransactions(statusFilter = '') {
        const url = statusFilter ? `${API_URL}/transactions?status=${statusFilter}` : `${API_URL}/transactions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
    },

    async getStats() {
        const res = await fetch(`${API_URL}/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
    },

    async updateStatus(id, { status, notes }) {
        const res = await fetch(`${API_URL}/transactions/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, notes })
        });
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
    },

    async uploadCSV(file) {
        const formData = new FormData();
        formData.append('csv', file);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error("Failed to upload CSV");
        return res.json();
    },

    async clearTransactions() {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error("Failed to clear transactions");
        return res.json();
    }
};
