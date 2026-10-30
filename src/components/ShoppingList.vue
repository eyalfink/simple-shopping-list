<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between border-b pb-2">
      <h2 class="text-xl font-bold text-gray-800">
        {{ title }}
      </h2>
      <span class="text-sm font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
        {{ items.length }} מוצרים
      </span>
    </div>

    <div v-if="items.length === 0" class="text-center py-8 text-gray-400">
      אין מוצרים להצגה
    </div>

    <div v-else class="space-y-2">
      <ItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        @toggle="$emit('toggle-item', $event)"
        @delete="$emit('delete-item', $event)"
        @view-image="$emit('view-image', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import ItemRow from './ItemRow.vue';

defineProps({
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'מוצרים פעילים'
  }
});

defineEmits(['toggle-item', 'delete-item', 'view-image']);
</script>
