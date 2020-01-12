<template>
  <div id="app">
    <div id="nav">
    <h3>collective</h3>
    <div v-if="!$auth.loading">
          <!-- show login when not authenticated -->
          <base-button v-if="!$auth.isAuthenticated" @click="login">Log in</base-button>
          <!-- show logout when authenticated -->
          <base-button v-if="$auth.isAuthenticated" @click="logout">Log out</base-button>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
   }
   }
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
