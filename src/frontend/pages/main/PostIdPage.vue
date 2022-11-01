<template>
  <div>
    This is page with id = {{ $route.params.id }}

    <div class="serv-info">
      <h1 v-if="isLoading">Loading...</h1>
      <h1 v-if="isError">An error occurred  while loading...</h1>
    </div>
    <post-item v-if="post.id"
            :post="post"
            :key="post.id"
    />

    <div v-if="post.id">
      <div v-for="(comment, idx) in comments" class="comment-item">
        <div class="comment-title">Comment № {{ idx+1 }} to post № {{ comment.postId }}</div>
        <div class="comment-body">{{ comment.name }} </div>
        <div class="comment-body">{{ comment.body }} </div>
        <div class="comment-email">{{ comment.email }} </div>
      </div>
    </div>



  </div>
</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";
  import {postApi} from '@/dal/PostApi';
  import { PostItem_Type, Comments_Type } from '@/dal/PostApi';
  import PostItem from "@/frontend/pages/main/PostItem.vue";


  export default defineComponent({
    name: "PostIdPage",
    components: { PostItem },

    data () {
      return {
        post: {} as PostItem_Type,
        comments: [] as Comments_Type[],
        isError: false as boolean,
        isLoading: false as boolean,
      }
    },

    methods: {
      async getPostIdFull(id: string) {

        this.isLoading = true;
        this.isError   = false;

        try {
          let [post, comments] = await postApi.getPostIdFull(id);
          this.post = post;
          this.comments = comments;
        }
        catch (e) {
          this.isError = true;
        }
        finally {
          this.isLoading = false
        }

      },
    },

    mounted() {
      this.getPostIdFull(this.$route.params.id as string)

    }

  })
</script>

<style scoped lang="less">

  .comment-title {
    margin-left: 15px;
  }

  .comment-item {
    outline: 2px solid orangered;
    border-radius: 5px;
    margin: 0 5px 15px auto;
    width: 98%;
  }

  .comment-body {
    margin: 10px 0;
    padding: 0 10px;
  }

  .comment-body::first-letter {
    text-transform: capitalize;
  }

  .comment-email {
    text-align: right;
    margin-right: 15px;
  }

</style>