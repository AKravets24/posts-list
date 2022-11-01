<template>

  <div class="post-item flexed">

    <div class="post-body">
      <h2 class="post-title">{{post.id}}) {{ post.title }} </h2>
      <p class="post-text">  {{ post.body }} </p>
    </div>

    <div v-if="needTail" class="post-tail flexed justifyed aligned">
      <my-button @click="$router.push(`/posts/${post.id}`)">Open</my-button>
      <my-button @click="$emit('remove', post.id)"> Delete</my-button>
    </div>

  </div>

</template>

<script lang="ts">
  export default {
    name: "PostItem",

    props: {
      post:     {type: Object,  required: true,},
      needTail: {type: Boolean, required: false, default: undefined},
    }

  }
</script>

<style scoped lang="less">

  @baseColor: teal;

  .post-item {
    outline: 2px solid @baseColor;
    border-radius: 3px;
    margin: 10px 5px;
    justify-content: space-between;
    padding: 10px 0;
  }

  .post-title {
    font-weight: 700;
    min-height: 30px;
    text-transform: capitalize;
  }

  .post-text {
    text-transform: capitalize;
  }

  .post-body {
    margin-left: 10px;
  }

  .post-tail {
    min-width: 150px;
    justify-self: end;
  }

</style>