<template>
  <div id="app">
    <div id="nav" style="position: fixed">
      <div style="position: relative">
        <base-nav type="default" effect="dark" expand>
            <h4 class="navbar-brand">collective</h4>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="https://demos.creative-tim.com/vue-argon-design-system/img/brand/blue.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <ul class="navbar-nav ml-lg-auto">
                <li class="nav-item">
                    <div v-if="!$auth.loading">
                      <!-- show login when not authenticated -->
                      <base-button class="navbar-brand" v-if="!$auth.isAuthenticated" @click="login">Log in</base-button>
                      <!-- show logout when authenticated -->
                      <base-button class="navbar-brand" v-if="$auth.isAuthenticated" @click="logout">Log out</base-button>
                    </div>
                </li>
              
            </ul>
        </base-nav>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import BaseNav from "@/components/BaseNav";
//import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
export default {
    components: {
      BaseNav,
      //BaseDropdown,
      CloseButton
    },
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
  width: 100%;
  z-index: 5;
  margin-top:-0.5rem;
}
</style>
