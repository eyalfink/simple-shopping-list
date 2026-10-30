<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-emerald-700 tracking-tight">🛒 רשימת קניות פשוטה</h1>
      <p class="text-gray-500 text-sm mt-1">ניהול קניות בזמן אמת ושיתוף משפחתי</p>
    </header>

    <!-- List Selector Component -->
    <ListSelector
      :lists="lists"
      :selectedListId="selectedListId"
      @select-list="selectedListId = $event"
      @create-list="handleCreateList"
      @delete-list="handleDeleteList"
    />

    <!-- Add Item Form -->
    <AddItemForm
      v-if="selectedListId"
      @add-item="handleAddItem"
    />

    <!-- Active Shopping List -->
    <div v-if="selectedListId" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <ShoppingList
        title="מוצרים לקנייה"
        :items="activeItems"
        @toggle-item="handleToggleItem"
        @delete-item="handleDeleteItem"
        @view-image="selectedImageUrl = $event"
      />
    </div>

    <!-- Bought Items Toggle -->
    <div v-if="selectedListId && historyItems.length > 0" class="mt-8">
      <button
        @click="showHistory = !showHistory"
        class="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition flex items-center gap-1"
      >
        <span>{{ showHistory ? 'הסתר מוצרים שנקנו' : 'הצג מוצרים שנקנו' }} ({{ historyItems.length }})</span>
      </button>

      <div v-if="showHistory" class="mt-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <ShoppingList
          title="היסטוריית קניות"
          :items="historyItems"
          @toggle-item="handleToggleItem"
          @delete-item="handleDeleteItem"
          @view-image="selectedImageUrl = $event"
        />
      </div>
    </div>

    <!-- Image Modal -->
    <ImageModal
      :imageUrl="selectedImageUrl"
      @close="selectedImageUrl = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ListSelector from './components/ListSelector.vue';
import AddItemForm from './components/AddItemForm.vue';
import ShoppingList from './components/ShoppingList.vue';
import ImageModal from './components/ImageModal.vue';

import {
  subscribeToLists,
  createList,
  deleteList,
  subscribeToItems,
  addItem,
  toggleItemStatus,
  deleteItem
} from './services/firestoreService';

const householdId = ref('default-household');
const lists = ref([]);
const selectedListId = ref('');
const activeItems = ref([]);
const historyItems = ref([]);
const showHistory = ref(false);
const selectedImageUrl = ref(null);

let unsubscribeActive = null;
let unsubscribeHistory = null;

onMounted(() => {
  subscribeToLists(householdId.value, (fetchedLists) => {
    lists.value = fetchedLists;
    if (fetchedLists.length > 0 && !selectedListId.value) {
      selectedListId.value = fetchedLists[0].id;
    }
  });
});

watch(selectedListId, (newListId) => {
  if (unsubscribeActive) unsubscribeActive();
  if (unsubscribeHistory) unsubscribeHistory();

  if (newListId) {
    unsubscribeActive = subscribeToItems(newListId, false, (items) => {
      activeItems.value = items;
    });
    unsubscribeHistory = subscribeToItems(newListId, true, (items) => {
      historyItems.value = items;
    });
  }
});

const handleCreateList = async (name) => {
  const newId = await createList(name, householdId.value);
  selectedListId.value = newId;
};

const handleDeleteList = async (listId) => {
  await deleteList(listId);
  selectedListId.value = lists.value.length > 0 ? lists.value[0].id : '';
};

const handleAddItem = async (itemData) => {
  if (selectedListId.value) {
    await addItem(selectedListId.value, itemData.name, itemData.quantity);
  }
};

const handleToggleItem = async (item) => {
  await toggleItemStatus(item.id, item.checked);
};

const handleDeleteItem = async (itemId) => {
  await deleteItem(itemId);
};
</script>
