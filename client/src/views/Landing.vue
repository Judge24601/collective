<template>
        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-1 main">
                <div class="shape shape-style-1 bg-gradient-default">
                </div>
                <div class="container">
                    <div>
                        <h1 class="navbar-brand">collective</h1>
                        <modal :show.sync="modals.modal0">
                            <template slot="header">
                                <h5 class="modal-title" id="exampleModalLabel">New Post</h5>
                            </template>
                            <template slot="footer">
                                <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
                                <base-button type="primary" >Save</base-button>
                            </template>
                        </modal>

                    </div>
                    <div v-if="!$auth.loading">
                      <!-- show login when not authenticated -->
                      <base-button class="navbar-brand" v-if="!$auth.isAuthenticated" @click="login">Log in</base-button>
                      <!-- show logout when authenticated -->
                      <base-button class="navbar-brand" v-if="$auth.isAuthenticated" @click="logout">Log out</base-button>
                    </div>
                </div>
            </section>
            <!-- 1st Hero Variation -->
        </div>  
</template>

<script>
import Modal from "@/components/Modal";
export default {
  name: "landing",
  components: {
    Modal
  },
  data () {
    return {
        modals: {
            modal0: false
        }
    };
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
};
</script>
<style>
    .newPost {
        margin-top: -1rem;
        margin-bottom: 1rem;
    }
    .container {
        height: 100%
    }
</style>
