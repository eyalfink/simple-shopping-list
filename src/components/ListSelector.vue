<template>
  <div class="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <label class="block text-sm font-bold text-gray-700 mb-2">בחר רשימת קניות:</label>
    <div class="flex items-center gap-2">
      <select
        :value="selectedListId"
        @change="$emit('select-list', $event.target.value)"
        class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option v-for="list in lists" :key="list.id" :value="list.id">
          {{ list.name }}
        </option>
      </select>

      <button
        @click="showCreateModal = true"
        class="bg-emerald-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
      >
        + רשימה חדשה
      </button>

      <button
        v-if="selectedListId"
        @click="handleDeleteList"
        class="bg-red-100 text-red-600 p-2.5 rounded-lg text-sm hover:bg-red-200 transition"
        title="מחק רשימה"
      >
        🗑️
      </button>
    </div>

    <!-- Create List Dialog -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-xl max-w-sm w-full space-y-4">
        <h3 class="text-lg font-bold text-gray-800">צור רשימת קניות חדשה</h3>
        <input
          v-model="newListName"
          placeholder="שם הרשימה (למשל: סופרמרקט)"
          class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
          @keyup.enter="handleCreateList"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            ביטול
          </button>
          <button
            @click="handleCreateList"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
          >
            צור
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  lists: {
    type: Array,
    required: true
  },
  selectedListId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['select-list', 'create-list', 'delete-list']);

const showCreateModal = ref(false);
const newListName = ref('');

const handleCreateList = () => {
  if (newListName.value.trim()) {
    emit('create-list', newListName.value.trim());
    newListName.value = '';
    showCreateModal.value = false;
  }
};

const handleDeleteList = () => {
  if (confirm('האם אתה בטוח שברצונך למחוק רשימה זו?')) {
    emit('delete-list', props.selectedListId);
  }
};
</script>
