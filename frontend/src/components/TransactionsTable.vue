<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm whitespace-nowrap">
      <thead class="text-xs uppercase bg-gray-100 text-gray-500 border-b border-gray-200">
        <tr>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider">Date</th>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider">Source Acc</th>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider">Target Acc</th>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider text-right">Amount</th>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider text-center">Status</th>
          <th scope="col" class="px-6 py-3 font-semibold tracking-wider text-center">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-if="loading">
          <td colspan="6" class="px-6 py-12 text-center text-gray-500">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading transactions...
          </td>
        </tr>
        
        <tr v-else-if="transactions.length === 0">
          <td colspan="6" class="px-6 py-12 text-center text-gray-500">
            No transactions found. Ingest a CSV file to get started.
          </td>
        </tr>
        
        <tr v-for="tx in transactions" :key="tx.id" 
            class="hover:bg-gray-50 transition-colors cursor-pointer group even:bg-gray-50/50"
            :class="{'border-l-2 border-l-red-600 bg-red-50/50': tx.is_anomaly && tx.investigation_status === 'pending'}"
            @click="$emit('select', tx)">
          
          <td class="px-6 py-2.5 text-gray-900">
            {{ new Date(tx.transaction_date).toLocaleDateString() }}
            <span class="text-xs text-gray-500 block">{{ new Date(tx.transaction_date).toLocaleTimeString() }}</span>
          </td>
          
          <td class="px-6 py-2.5 text-gray-600">{{ tx.account_id }}</td>
          <td class="px-6 py-2.5 text-gray-600">
            <div class="flex items-center space-x-2">
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              <span>{{ tx.target_account_id }}</span>
            </div>
          </td>
          
          <td class="px-6 py-2.5 text-right">
            <span class="font-medium" :class="tx.is_anomaly ? 'text-red-700' : 'text-gray-900'">
              {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount) }}
            </span>
          </td>
          
          <td class="px-6 py-2.5 text-center">
            <span v-if="tx.investigation_status === 'pending'" class="inline-block px-2 py-0.5 border border-yellow-300 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-sm">
              REVIEW
            </span>
            <span v-else-if="tx.investigation_status === 'cleared'" class="inline-block px-2 py-0.5 border border-green-300 bg-green-50 text-green-700 text-xs font-semibold rounded-sm">
              CLEARED
            </span>
            <span v-else-if="tx.investigation_status === 'fraud'" class="inline-block px-2 py-0.5 border border-red-300 bg-red-50 text-red-700 text-xs font-semibold rounded-sm">
              FRAUD
            </span>
          </td>
          
          <td class="px-6 py-2.5 text-center">
            <button class="text-red-700 hover:text-red-800 hover:underline text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
              Investigate
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: true
  }
});

defineEmits(['select']);
</script>
