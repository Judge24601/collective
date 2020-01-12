<script src="https://js.stripe.com/v3/"></script>
<template>
  <div id="app" class="bg-gradient-default">
    <div v-if="$route.name !== 'landing'" id="nav" style="position: fixed">
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
    <modal :show.sync="authenticatedNotCreated">
      <template slot="header">
          <h5 class="modal-title" id="exampleModalLabel">Set up Subscription</h5>
      </template>
      <checkout @exit="closeModal"></checkout>
      <!-- <template slot="footer">
          <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
          <base-button type="primary" >Save</base-button>
      </template> -->
    </modal>
    <router-view />
  </div>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import UserService from "@/services/UserService";
//import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import Modal from "@/components/Modal";
import Checkout from "@/components/Checkout";
import { mapMutations } from 'vuex'

export default {
    components: {
      BaseNav,
      CloseButton,
      Modal,
      Checkout,
    },
    data () {
      return {
        openModal: true
      };
    },
    ...mapMutations([
      'updateUser', // map `this.increment()` to `this.$store.commit('increment')`
    ]),
    computed: {
    user () {
      return this.$store.state.user
    }
  },
    asyncComputed: {
      authenticatedNotCreated: async function () {
        if (!this.openModal) {
          return false
        }
        console.log("auth!", this.$auth.user)
        if (this.$auth.isAuthenticated){
          let email = this.$auth.user.email
          let user = await UserService.getUser(email)
          console.log(user)
          this.$store.commit('updateUser', user.data)
          console.log(this.user == "")
          if (this.user == "") {
            console.log('should be showing')
            return true
          }
          return (this.user.customerId == undefined)
        }
        return false
      }
    },
    methods: {
      // Log the user in
      login() { 
        this.$auth.loginWithRedirect();
        this.getUser()
      },
      // Log the user out
      logout() {
        this.$auth.logout({
          returnTo: window.location.origin
        });
      },
      closeModal () {
        console.log('close modal')
        this.openModal = false
      }
    }
  }
</script>
  }
};

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow: scroll;
}
#nav {
  width: 100%;
  z-index: 5;
  margin-top:-0.5rem;
  
}
</style>
