<template>

  <div class="modal-background" @click="closeModal">

    <div class="modal-body flexed centred" @click.stop>
      <form @submit.prevent class="form">
        <div class="flexed columned">
          <my-input  size="large" placeholder="Title" :value="title" @input="title = $event.target.value"/>
          <my-input  size="large" placeholder="Body"  :value="body" @input="body  = $event.target.value"/>
          <my-button size="large" class="btn" :disabled="!title || !body" type="submit"
                     @click="createPost"
          >
            Create post
          </my-button>
        </div>
      </form>
    </div>

  </div>


</template>

<script lang="ts">
  import {defineComponent} from "@vue/runtime-core";

  export default defineComponent({
    name: "PostForm",

    data() {
      return {
        title: '' as string,
        body:  '' as string,
      }
    },

    methods: {
      createPost() {

        this.$emit('createPost', {
          id: new Date().getTime(),
          title: this.title,
          body: this.body,
        });

        this.title = '';
        this.body = '';

        this.closeModal()
      },

      closeModal () {
        this.$emit('closeModal')
      }

    },

  })
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"/>

<style scoped lang="less">

  @baseColor: teal;

  .modal-background {
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(190, 191, 195, .7);
  }

  .modal-body {
    min-height: 250px;
    width: 500px;
    border-radius: 5px;
    border: 2px solid @baseColor;
    background: whitesmoke;
  }
  .form {
    width: 90%;
  }

  .btn {
    align-self: end;
  }

</style>