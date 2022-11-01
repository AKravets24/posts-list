<template>
  <div class="navbar-wrapper flexed justifyed aligned">
    <span class="large link"><router-link to="/posts">Main page </router-link></span>
    <span class="large link"><router-link to="/game">Game </router-link></span>
    <span class="large link"><router-link to="about">About </router-link></span>
  </div>
</template>

<script>
    export default {
        name: "NavBar"
    }
</script>

<style src="@/frontend/mixins/_mixins.less" lang="less"></style>

<style scoped>

  .navbar-wrapper {
    height: 70px;
    background: lightyellow;
  }

  .navbar-wrapper a {
    text-decoration: none;
    color: teal;
  }

</style>