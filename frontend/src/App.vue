<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-red-700 flex items-center justify-center rounded-sm">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-gray-900">Fraud Intelligence</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="clearData"
          class="bg-white hover:bg-gray-50 text-gray-700 transition-colors px-4 py-1.5 flex items-center space-x-2 text-sm font-medium rounded-sm border border-gray-300"
          :class="{'opacity-50 cursor-not-allowed': clearing}"
          :disabled="clearing"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span>{{ clearing ? 'Clearing...' : 'Clear All' }}</span>
        </button>
        <button 
          @click="triggerUpload"
          class="bg-red-700 hover:bg-red-800 text-white transition-colors px-4 py-1.5 flex items-center space-x-2 text-sm font-medium rounded-sm border border-red-800"
          :class="{'opacity-50 cursor-not-allowed': uploading}"
          :disabled="uploading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>{{ uploading ? 'Uploading...' : 'Ingest Data (CSV)' }}</span>
        </button>
        <input type="file" ref="fileInput" class="hidden" accept=".csv" @change="handleFileUpload" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
      
      <DashboardStats :stats="stats" :loading="loadingStats" />
      
      <div class="bg-white border border-gray-200 shadow-sm mt-8">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 class="text-lg font-semibold text-gray-900 tracking-tight">Recent Transactions</h2>
          <div class="flex space-x-1 bg-gray-100 rounded-sm p-1 border border-gray-200">
            <button @click="statusFilter = ''" :class="statusFilter === '' ? 'bg-white shadow-sm border-gray-200 text-gray-900' : 'hover:bg-gray-200 text-gray-600 border-transparent'" class="px-4 py-1 text-xs font-medium rounded-sm border transition">All</button>
            <button @click="statusFilter = 'pending'" :class="statusFilter === 'pending' ? 'bg-white shadow-sm border-gray-200 text-gray-900' : 'hover:bg-gray-200 text-gray-600 border-transparent'" class="px-4 py-1 text-xs font-medium rounded-sm border transition">Pending Review</button>
            <button @click="statusFilter = 'fraud'" :class="statusFilter === 'fraud' ? 'bg-white shadow-sm border-gray-200 text-gray-900' : 'hover:bg-gray-200 text-gray-600 border-transparent'" class="px-4 py-1 text-xs font-medium rounded-sm border transition">Confirmed Fraud</button>
          </div>
        </div>
        
        <TransactionsTable 
          :transactions="filteredTransactions" 
          :loading="loadingTx" 
          @select="openInvestigation"
        />
      </div>

    </main>

    <InvestigationModal 
      v-if="selectedTx" 
      :transaction="selectedTx" 
      @close="selectedTx = null"
      @status-updated="handleStatusUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import DashboardStats from './components/DashboardStats.vue';
import TransactionsTable from './components/TransactionsTable.vue';
import InvestigationModal from './components/InvestigationModal.vue';
import { api } from './services/api';

const fileInput = ref(null);
const uploading = ref(false);
const clearing = ref(false);

const stats = ref({ totalTransactions: 0, totalAnomalies: 0, pendingCases: 0 });
const loadingStats = ref(true);

const transactions = ref([]);
const loadingTx = ref(true);
const statusFilter = ref('');

const selectedTx = ref(null);

const triggerUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  try {
    await api.uploadCSV(file);
    await refreshData();
    alert('Ingestion complete!');
  } catch (error) {
    alert('Failed to upload file');
    console.error(error);
  } finally {
    uploading.value = false;
    event.target.value = null; // reset 
  }
};

const clearData = async () => {
  if (!confirm("Are you sure you want to clear all transactions?")) return;
  
  clearing.value = true;
  try {
    await api.clearTransactions();
    await refreshData();
    // No alert needed, fast operation is better UI
  } catch (error) {
    alert('Failed to clear data');
    console.error(error);
  } finally {
    clearing.value = false;
  }
};

const refreshData = async () => {
  loadingStats.value = true;
  loadingTx.value = true;
  
  try {
    const [statsData, txData] = await Promise.all([
      api.getStats(),
      api.getTransactions(statusFilter.value)
    ]);
    
    stats.value = statsData;
    transactions.value = txData;
  } catch (error) {
    console.error("Error refreshing data", error);
  } finally {
    loadingStats.value = false;
    loadingTx.value = false;
  }
};

const openInvestigation = (tx) => {
  selectedTx.value = tx;
};

const handleStatusUpdated = () => {
  selectedTx.value = null;
  refreshData(); // Refresh to show new status
};

watch(statusFilter, () => {
  refreshData();
});

const filteredTransactions = computed(() => {
  // We handle filtering via API mostly, but computed is here if we want client side logic
  return transactions.value;
});

onMounted(() => {
  refreshData();
});
</script>

<style>
/* Scoped overrides if needed */
</style>
