import {postApi} from "@/dal/PostApi";
import type { PostItem_Type} from "@/dal/PostApi";

export type PostStateType = typeof postModule.state;

export type SelectedSort_Type = 'title' | 'body'

export const postModule =  {

  state: () => ({
    posts: [] as PostItem_Type[],

    page:        1   as number,
    pageSize:    10  as number,
    limit:       100 as number,

    isLoading:   false as boolean,
    isError:     false as boolean,

    searchValue:    '' as string,
    debouncedValue: '' as string,

    selectedSort:   '' as SelectedSort_Type,
    sortOptions: [
      { name: 'By header',  value: 'title' },
      { name: 'By content', value: 'body'  },
    ] as {name: string, value: string}[],

    _timeoutID: null as any,
  }),

  getters: { // computed св-ва

    searchedPosts ( state: any ) : PostItem_Type[]  {
      if(state.debouncedValue.length >= 3) {
        return [...state.posts].filter((post) =>
            post.title.toLowerCase().includes(state.debouncedValue.toLowerCase()) );
      }
      return [...state.posts];
    },

    postSorter: (state: any, getters: any) => ( newValue: SelectedSort_Type ) => {
        return getters.searchedPosts.sort((postA: PostItem_Type, postB: PostItem_Type) =>
            postA[newValue]?.localeCompare(postB[newValue])
        )

    }
  },
  mutations: {  // methods
    setPosts          (state: any, posts: PostItem_Type[])    { state.posts = posts                   },
    setPage           (state: any, page: number)              { state.page = page                     },
    setIsLoading      (state: any, isLoading: boolean)        { state.isLoading = isLoading           },
    setIsError        (state: any, isError: boolean)          { state.isError = isError               },

    updateSelect      (state: any, {target}: {target: HTMLInputElement})       {
      state.selectedSort = target.value
    },

    createPost(state: any, newPost: PostItem_Type) { state.posts.unshift(newPost) },


    removePost(state: any, id: number ) {
      return state.posts = state.posts.filter((el: PostItem_Type) => el.id !== id)
    },


    async setDebounce (state: any, { value, delay= 500 }: {value: string, delay: number} ) {
      clearTimeout(state._timeoutID);
      state._timeoutID = await setTimeout(() => {
        return state.debouncedValue = value
      }, delay);
    },

  },
  actions: {
    async getPosts({state, commit, dispatch}: any, { page, size} : {page: number, size: number}) {


      commit('setIsLoading', true);
      commit('setIsError', false);

      try {
        const newPosts = await postApi.getPosts(page, size);
        commit('setPosts', [...state.posts, ...newPosts]);
        commit('setPage', page+1);
      }
      catch (e) {
        commit('setIsError', true);
      }
      finally {
        commit('setIsLoading', false);
      }

    },

  },
  namespaced: true,
};