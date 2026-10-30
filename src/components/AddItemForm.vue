<template>
  <div class="relative mb-6">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="itemName"
          @input="handleInput"
          placeholder="הוסף מוצר לרשימה..."
          class="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
          @keyup.enter="handleAddItem"
        />
        <!-- Autocomplete Suggestions Dropdown -->
        <div
          v-if="suggestions.length > 0"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
        >
          <div
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="selectSuggestion(suggestion)"
            class="p-2.5 hover:bg-emerald-50 cursor-pointer text-sm text-gray-700 border-b last:border-b-0"
          >
            {{ suggestion }}
          </div>
        </div>
      </div>

      <input
        v-model="itemQuantity"
        placeholder="כמות"
        class="w-20 bg-white border border-gray-300 text-gray-900 text-sm rounded-xl p-3 text-center shadow-sm"
        @keyup.enter="handleAddItem"
      />

      <button
        @click="handleAddItem"
        class="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition"
      >
        הוסף
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { searchProductHistory } from '../services/firestoreService';

const emit = defineEmits(['add-item']);

const itemName = ref('');
const itemQuantity = ref('1');
const suggestions = ref([]);

const handleInput = async () => {
  if (itemName.value.trim().length > 0) {
    suggestions.value = await searchProductHistory(itemName.value);
  } else {
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  itemName.value = suggestion;
  suggestions.value = [];
};

const handleAddItem = () => {
  if (itemName.value.trim()) {
    emit('add-item', {
      name: itemName.value.trim(),
      quantity: itemQuantity.value || '1'
    });
    itemName.value = '';
    itemQuantity.value = '1';
    suggestions.value = [];
  }
};
</script>
