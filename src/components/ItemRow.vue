<template>
  <div class="flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200 transition">
    <div class="flex items-center gap-3">
      <!-- Checkbox / V Mark -->
      <button
        @click="$emit('toggle', item)"
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition"
        :class="item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-500'"
      >
        <span v-if="item.checked" class="text-xs font-bold">✓</span>
      </button>

      <div>
        <span :class="{'line-through text-gray-400': item.checked, 'text-gray-800 font-medium': !item.checked}">
          {{ item.name }}
        </span>
        <span class="mr-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          x{{ item.quantity }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- Image Thumbnail Button if image exists -->
      <button
        v-if="item.imageUrl"
        @click="$emit('view-image', item.imageUrl)"
        class="text-gray-500 hover:text-emerald-600 p-1"
        title="הצג תמונה"
      >
        🖼️
      </button>

      <!-- Delete Button -->
      <button
        @click="$emit('delete', item.id)"
        class="text-gray-400 hover:text-red-500 p-1 transition"
        title="מחק מוצר"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['toggle', 'delete', 'view-image']);
</script>
