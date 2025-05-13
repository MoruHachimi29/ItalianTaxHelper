<template>
  <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <div class="mb-4 flex justify-center">
      <span class="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full">
        <i class="material-icons">{{ icon }}</i>
      </span>
    </div>
    <h3 class="text-xl font-semibold mb-2 text-center">{{ title }}</h3>
    <p class="text-gray-600 mb-4 text-center">{{ description }}</p>
    <div class="text-center">
      <router-link :to="to" class="inline-flex items-center justify-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition">
        Compila ora
      </router-link>
    </div>
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
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'description'
  }
});
</script>