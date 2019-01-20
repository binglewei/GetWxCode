<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  watch: {
    '$route': 'routerFun'
  },
  methods: {
    routerFun (to, from) {
      console.log('routerFun', to, from)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  min-width: 1200px;
  margin: 0;
  padding: 0;
}
</style>
