<template>

  <div v-if="!reversed" class="stat-item flexed justified"
       :class="{
            'base-font' : size === 'medium',
            'small-font': size === 'small',
            'large-font': size === 'large',
       }"
  >
    <div>{{ text }}</div>
    <div>{{ value }} {{ units }} </div>
  </div>

  <div v-else class="stat-item-reversed flexed justified"
       :class="{
            'base-font' : size === 'medium',
            'small-font': size === 'small',
            'large-font': size === 'large',
       }"
  >
    <div>{{ value }} {{ units }}</div>
    <div>{{ text }}</div>
  </div>

</template>

<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
    name: "StatItem",

    props: {
      text:     { type: String, required: true   },
      value:    { type: [ String, Number ],  required: true  },
      units:    { type: String,  required: false },
      reversed: { type: Boolean, required: false},
      size:     { type: String,  required: false, default: null},
    },

  })
</script>

<style scoped lang="less">


  @smallFontSize: 15px;
  @baseFontSize:  20px;
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


  .justified {
    justify-content: space-between;
  }


  .stat-item,
  .stat-item-reversed {
    width: 100%;
  }

  .stat-item div:first-child {
    /*min-width: 200px;*/
    /*width: 70%;*/
  }

  .stat-item div:nth-child(2) {
    width: 60px;
    text-align: center;
  }

  .stat-item-reversed div:first-child {
    width: 50px;
    text-align: center;
  }

  .stat-item-reversed div:nth-child(2) {
    text-align: right;
  }

</style>