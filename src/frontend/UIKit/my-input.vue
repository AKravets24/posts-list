<template>
  <input
          :value="modelValue"
          @input="changeInput"
          class="input" type="text"
          :class="{
            'medium': size === 'medium',
            'small':  size === 'small',
            'large':  size === 'large',
          }"
          :placeholder="placeholder"
  >
</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";


  export default defineComponent({

    name: "MyInput",


    emits: ['update:modelValue'],

    props: {
      placeholder: {
        type: String,
        required: false,
      },
      title: {
        type: String,
      },
      size: {
        type: String,
        required: false,
        default: 'medium',
      },
    }
  })
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"/>

<style scoped lang="less">
  .input {
    width: calc(100% - 10px);
    margin: 5px auto;
    padding: 3px;
    outline: none;
    border: 1px solid teal;
    border-radius: 3px;
  }

</style>

<!-- v-model="modelValue"-->