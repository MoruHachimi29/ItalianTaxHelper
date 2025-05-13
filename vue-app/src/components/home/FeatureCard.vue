<template>
  <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
    <div class="mb-4">
      <span class="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full">
        <i class="material-icons">{{ icon }}</i>
      </span>
    </div>
    <h3 class="text-xl font-semibold mb-2 text-center">{{ title }}</h3>
    <p class="text-gray-600 text-center">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'check_circle'
  }
});
</script>