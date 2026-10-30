<template>
  <div v-if="imageUrl" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="relative bg-white p-2 rounded-2xl max-w-2xl w-full">
      <button
        @click="$emit('close')"
        class="absolute top-4 left-4 bg-gray-900/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-900 transition"
      >
        ✕
      </button>
      <img :src="imageUrl" alt="תמונת מוצר" class="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: {
    type: String,
    default: null
  }
});

defineEmits(['close']);
</script>
