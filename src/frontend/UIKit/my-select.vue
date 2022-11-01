<template>
  <select
          :value="modelValue"
          @change="changeSelect"
          class="base bordered"
          :class="{
            'medium': size === 'medium',
            'small':  size === 'small',
            'large':  size === 'large',
            'select': size === 'large',
            }"
  >
    <option disabled value="">Select from the list</option>
    <option v-for="option in options"
            :key="option.value"
            :value="option.value"
    >{{ option.name }}</option>
  </select>
</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";

  export default defineComponent({
    name: "my-select",

    methods: {
      changeSelect(e: HTMLSelectElement) {
        this.$emit('update:modelValue', e)
      }
    },

    emits: ['update:modelValue'],

    props: {
      modelValue: {
        type: String,
      },
      options: {
        type: Array, required: true,
        default: () => []
      },
      size: {
        type: String,
        required: false,
        default: 'large'
      },
    }
  })
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"/>

<style scoped>

  .base {
    outline: none
  }

  .select {
    height: 42px
  }


</style>

<!--v-model="modelValue"-->