<template>
  <div class="container">
    <nav-bar/>
    <router-view/>

  </div>

</template>

<script>
  import NavBar from "@/frontend/pages/navbar/NavBar";

  export default {
      components: {
          NavBar
      },
      mounted() {
          console.log(this.$route.path)
          if (!this.$route.path || this.$route.path === '/') {
              this.$router.push('/posts')
          }

      }
  }

</script>

<style lang="less">

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container {
    width: 100%;
    min-height: 99vh;
    margin: 0 auto;
  }

</style>