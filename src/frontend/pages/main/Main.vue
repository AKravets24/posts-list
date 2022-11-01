<template>


  <post-form
          v-if="dialogShown"
          @createPost="createPost"
          @closeModal="dialogShown = false"
          :isLoading="isLoading"
          :isError="isError"
  />
  <my-button
            size="large"
            @click="dialogShown = true"
            :disabled="isLoading || isError"
    >
      Create post
    </my-button>

  <my-select
          v-model:value="selectedSort"
          :options="sortOptions"
          @change="updateSelect"
  />

  <my-input
          v-model:value="searchValue"
          @input="setDebounce({value: $event.target.value, delay: 1000})"
          placeholder = 'Search the post...' size="large"/>


  <post-list
            :posts="postSorter(selectedSort)"
            :isLoading="isLoading"
            :isError="isError"
            @remove="removePost"
    />

  <div class="observer" ref='observer'>Observer!</div>



</template>

<script lang="ts">

  import {defineComponent} from "@vue/runtime-core";
  import PostForm from '@/frontend/pages/main/PostForm.vue';
  import PostList from '@/frontend/pages/main/PostList.vue';
  import { mapState, mapActions, mapMutations, mapGetters,} from 'vuex'

  export default defineComponent({

    name: "Main",

    components: {PostForm, PostList},

    data:() => ({ dialogShown: false }),

    computed: {
      ...mapState({
        posts:           (state: any) => state.post.posts,
        page:            (state: any) => state.post.page,
        pageSize:        (state: any) => state.post.pageSize,
        limit:           (state: any) => state.post.limit,
        isLoading:       (state: any) => state.post.isLoading,
        isError:         (state: any) => state.post.isError,
        searchValue:     (state: any) => state.post.searchValue,
        debouncedValue:  (state: any) => state.post.debouncedValue,
        selectedSort:    (state: any) => state.post.selectedSort,
        sortOptions:     (state: any) => state.post.sortOptions,
        _timeoutID:      (state: any) => state.post._timeoutID,
      }),

      ...mapGetters({
          postSorter:    'post/postSorter',
      }),

    },

    methods: {
      ...mapMutations({
        updateSelect: 'post/updateSelect',
        setDebounce:  'post/setDebounce',
        setPosts:     'post/setPosts',
        createPost:   'post/createPost',
        removePost:   'post/removePost',
        setPage:      'post/setPage',
      }),

      ...mapActions({
        fetchPosts:   'post/getPosts',
      }),

      createObserver() {
        const options = {
          rootMargin: '5px',
          threshold: 1.0
        };
        const cb = (entries: any, observer: any) => {
          if(entries[0].isIntersecting) {

          if (this.page === 11 || this.isLoading) { return }
          this.fetchPosts({page: this.page, size: this.pageSize})
          }
        };
        const observer = new IntersectionObserver(cb, options);
        observer.observe(this.$refs.observer as Element)
      },


    },

    mounted(): void {
      this.createObserver()
    },

    unmounted(): void {
      this.setPosts([]);
      this.setPage(1);
    },

  })

</script>


<style lang="less">

  .container {
    width: 99%;
    min-height: 99vh;
    margin: 0 auto;
    /*outline: 2px solid red;*/
  }

  .observer {
    height: 20px;
  }

</style>

