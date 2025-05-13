<template>
  <div class="border rounded-md p-4 bg-white shadow-sm">
    <h3 class="text-lg font-semibold mb-4">Dati del Contribuente</h3>
    
    <!-- Tipo contribuente -->
    <div class="mb-4">
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <input
            type="radio"
            id="person"
            name="taxpayerType"
            value="person"
            v-model="formData.taxpayerType"
            class="mr-2"
          />
          <label for="person">Persona Fisica</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="company"
            name="taxpayerType"
            value="company"
            v-model="formData.taxpayerType"
            class="mr-2"
          />
          <label for="company">Altro</label>
        </div>
      </div>
    </div>
    
    <!-- Codice fiscale / P.IVA -->
    <div class="mb-4">
      <label for="fiscalCode" class="form-label">Codice Fiscale / Partita IVA</label>
      <input
        type="text"
        id="fiscalCode"
        v-model="formData.fiscalCode"
        class="form-input tax-code-input"
        maxlength="16"
      />
    </div>
    
    <!-- Dati azienda o dati persona fisica -->
    <div v-if="formData.taxpayerType === 'company'">
      <div class="mb-4">
        <label for="companyName" class="form-label">Denominazione</label>
        <input
          type="text"
          id="companyName"
          v-model="formData.companyName"
          class="form-input"
        />
      </div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="lastName" class="form-label">Cognome</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            class="form-input"
          />
        </div>
        <div>
          <label for="firstName" class="form-label">Nome</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            class="form-input"
          />
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="birthDate" class="form-label">Data di nascita</label>
          <input
            type="date"
            id="birthDate"
            v-model="formData.birthDate"
            class="form-input"
          />
        </div>
        <div>
          <label for="birthPlace" class="form-label">Comune di nascita</label>
          <input
            type="text"
            id="birthPlace"
            v-model="formData.birthPlace"
            class="form-input"
          />
        </div>
      </div>
      
      <div class="mb-4">
        <label class="form-label">Sesso</label>
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <input
              type="radio"
              id="male"
              name="sex"
              value="M"
              v-model="formData.sex"
              class="mr-2"
            />
            <label for="male">M</label>
          </div>
          <div class="flex items-center">
            <input
              type="radio"
              id="female"
              name="sex"
              value="F"
              v-model="formData.sex"
              class="mr-2"
            />
            <label for="female">F</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// Creiamo un oggetto reattivo che fa da ponte con il model esterno
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>