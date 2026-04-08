<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click.self="$emit('close')">
    <div class="bg-white border top-border-red border-gray-200 rounded-sm shadow-xl w-full max-w-2xl overflow-hidden font-sans border-t-4 border-t-red-700">
      
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 class="text-lg font-bold text-gray-900 flex items-center space-x-2 tracking-tight">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span>Case Review: #{{ transaction.id }}</span>
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-900 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Alert for Anomalies -->
        <div v-if="transaction.is_anomaly" class="bg-red-50 border border-red-200 rounded-sm p-4 flex items-start space-x-3">
          <svg class="w-6 h-6 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <h4 class="text-sm font-bold text-red-800">System Warning: Anomaly Detected</h4>
            <p class="text-sm text-red-700 mt-1">{{ transaction.anomaly_reason }}</p>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-6 p-5 bg-gray-50 border border-gray-200">
          <div>
            <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Date & Time</p>
            <p class="text-gray-900 font-medium">{{ new Date(transaction.transaction_date).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Amount</p>
            <p class="text-xl font-bold text-gray-900 tracking-tight">
              {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Source Account</p>
            <p class="font-mono text-gray-600 text-sm">{{ transaction.account_id }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Target Account</p>
            <p class="font-mono text-gray-600 text-sm">{{ transaction.target_account_id }}</p>
          </div>
        </div>

        <!-- Investigator Form -->
        <div class="space-y-5 pt-5 border-t border-gray-200 mt-6">
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wider">Investigation Notes</label>
            <textarea 
              v-model="formNotes" 
              rows="3" 
              class="w-full bg-white border border-gray-300 rounded-sm px-4 py-2 text-gray-900 focus:ring-1 focus:ring-red-700 focus:border-red-700 transition-all font-mono text-sm placeholder-gray-400"
              placeholder="Enter details of your investigation here..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wider">Verdict Status</label>
            <div class="flex space-x-3">
              <label class="flex-1 cursor-pointer">
                <input type="radio" value="cleared" v-model="formStatus" class="peer sr-only" />
                <div class="py-2 px-3 text-center rounded-sm border border-gray-300 peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:text-green-800 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                  Mark as Cleared
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input type="radio" value="fraud" v-model="formStatus" class="peer sr-only" />
                <div class="py-2 px-3 text-center rounded-sm border border-gray-300 peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-800 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                  Confirm Fraud
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input type="radio" value="pending" v-model="formStatus" class="peer sr-only" />
                <div class="py-2 px-3 text-center rounded-sm border border-gray-300 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 peer-checked:text-yellow-800 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">
                  Keep Pending
                </div>
              </label>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">Cancel</button>
        <button 
          @click="submitUpdate" 
          :disabled="updating"
          class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-sm border border-red-800 transition-all focus:ring-1 focus:ring-offset-2 focus:ring-red-700 focus:outline-none flex items-center"
        >
          <svg v-if="updating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Save Resolution
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'status-updated']);

const formNotes = ref('');
const formStatus = ref('');
const updating = ref(false);

onMounted(() => {
  formNotes.value = props.transaction.notes || '';
  formStatus.value = props.transaction.investigation_status || 'pending';
});

const submitUpdate = async () => {
  updating.value = true;
  try {
    await api.updateStatus(props.transaction.id, {
      status: formStatus.value,
      notes: formNotes.value
    });
    emit('status-updated');
  } catch (err) {
    alert('Failed to update status');
    console.error(err);
  } finally {
    updating.value = false;
  }
};
</script>
