  <script setup>
  import{ ref } from 'vue'
  defineProps({
    prevent: Boolean,
    title: {
      type: String,
      required: true,
      default: 'Dropdown',
    }
  })

  const toggled = ref(false)
  const checkToggle = () => {
    toggled.value = !toggled.value
  }
  </script>

  <template>
    <div
      class="relative"
    >
      <button
        v-if="!$slots['header']"
        class="inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="toggled = !toggled"
      >
        {{ title }}
      </button>
      <slot
        name="header"
        :onClick="checkToggle"
      />
      <div
        v-if="toggled"
        class="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        @click="prevent ? prevent : toggled = false"
        @mouseleave="prevent ? prevent : toggled = false"
      >
        <div
          class="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <slot
            role="menuitem"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            name="options"
          />
        </div>
      </div>
    </div>
  </template>
