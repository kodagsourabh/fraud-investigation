<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    <!-- Total Checked -->
    <div class="bg-white p-5 border border-gray-200 shadow-sm relative overflow-hidden group border-t-4 border-t-gray-400 font-sans">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">TOTAL TRANSACTIONS</p>
          <div class="mt-2 flex items-baseline">
            <h3 class="text-3xl font-bold text-gray-900 tracking-tight">
              <span v-if="loading" class="animate-pulse bg-gray-200 text-transparent rounded w-20 inline-block">--</span>
              <span v-else>{{ stats.totalTransactions.toLocaleString() }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Anomalies Flagged -->
    <div class="bg-white p-5 border border-gray-200 shadow-sm relative overflow-hidden group border-t-4 border-t-red-700 font-sans">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">ANOMALIES DETECTED</p>
          <div class="mt-2 flex items-baseline">
            <h3 class="text-3xl font-bold text-red-700 tracking-tight">
              <span v-if="loading" class="animate-pulse bg-gray-200 text-transparent rounded w-16 inline-block">--</span>
              <span v-else>{{ stats.totalAnomalies.toLocaleString() }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Cases -->
    <div class="bg-white p-5 border border-gray-200 shadow-sm relative overflow-hidden group border-t-4 border-t-yellow-500 font-sans">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">CASES IN REVIEW</p>
          <div class="mt-2 flex items-baseline">
            <h3 class="text-3xl font-bold text-gray-900 tracking-tight">
              <span v-if="loading" class="animate-pulse bg-gray-200 text-transparent rounded w-12 inline-block">--</span>
              <span v-else>{{ stats.pendingCases.toLocaleString() }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: true
  }
});
</script>
