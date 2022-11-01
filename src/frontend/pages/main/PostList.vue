<template>

  <div class="flexed justifyed">
    <h1>Here is the post list</h1>
  </div>

  <div v-if="!posts?.length && !isLoading" class="flexed justifyed">
    <h1> There are no posts yet! </h1>
  </div>

  <transition-group name="post-item">

    <post-item
            v-for="post in posts"
            :post="post"
            :key="post.id"
            needTail
            @remove="$emit('remove', post.id)"
    />

  </transition-group>



  <div class="serv-info">
    <h1 v-if="isLoading">Loading...</h1>
    <h1 v-if="isError">An error occurred  while loading...</h1>
  </div>



</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";
  import PostItem from '@/frontend/pages/main/PostItem.vue'

  export default defineComponent({
    name: "PostList",

    components: { PostItem },

    props: {
      posts:     { type: Object, required: true,  },
      isLoading: { type: Boolean, required: true, },
      isError:   { type: Boolean, required: true, },
    },

  })
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"/>

<style scoped lang="less">
  .serv-info {
    text-align: center;
  }

  .post-item-item {
    display: inline-block;
    margin-right: 10px;
  }
  .post-item-enter-active,
  .post-item-leave-active {
    transition: all 0.4s ease;
  }
  .post-item-enter-from,
  .post-item-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }


</style>