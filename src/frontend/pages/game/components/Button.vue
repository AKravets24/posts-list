<template>
  <button type="button" class="btn"
          :class="{
            'danger'    : lightToggle === true,
            'silent'    : lightToggle === false,
            'base-font' : size === 'medium',
            'small-font': size === 'small',
            'large-font': size === 'large',
            }"
  >
    <slot></slot>
  </button>
</template>


<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
    name: "MyButton",

    props: {
      lightToggle: {type: Boolean, required: false, default: null},
      size:    {type: String, required: false,  default: 'medium'},
    }


  })
</script>

<style scoped lang="less">

  @smallFontSize: 10px;
  @baseFontSize: 15px;
  @largeFontSize: 25px;

  .base-font {
    font-size: @baseFontSize;
  }

  .small-font {
    font-size: @smallFontSize;
  }

  .large-font {
    font-size: @largeFontSize;
  }

  .btn {
    margin: 10px ;
    padding: 5px 10px;
    border: 2px solid teal;
    border-radius: 5px;
    cursor: pointer;
  }

  .danger {
    background: firebrick;
  }

  .silent {
    background: lightgreen;
  }

</style>
