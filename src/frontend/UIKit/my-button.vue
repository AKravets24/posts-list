<template>
  <button type="button" class="btn"
          :class="{
            'danger': lightToggle === true,
            'silent': lightToggle === false,
            'medium': size === 'medium',
            'small':  size === 'small',
            'large':  size === 'large',
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
      lightToggle: { type: Boolean, required: false,  default: null    },
      size:        { type: String,  required: false,  default: 'medium'},
    }


  })
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"/>

<style scoped lang="less">

  .btn {
    /*margin: 0 5px;*/
    margin: 5px;
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
