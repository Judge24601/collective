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
                                <h5 class="modal-title" id="exampleModalLabel">Found a Collective</h5>
                            </template>
                            <form>
                                <base-input alternative v-model="title" placeholder="Title"></base-input>
                                <base-input alternative v-model="summary" placeholder="Summary"></base-input>
                                <textarea v-model="notes" class="form-control form-control-alternative" rows="3" placeholder="Notes"></textarea>
                            </form>
                            <template slot="footer">
                                <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
                                <base-button type="primary" @click="newCollective">Save</base-button>
                            </template>
                        </modal>
                    </div>
                    <div class="landing-buttons">
                        <base-button size="lg" type="primary" icon="fa fa-gavel" class="landing-b" @click="modals.modal0 = true">Found Collective</base-button>
                        <base-button size="lg" type="primary" icon="fa fa-user-plus" class="landing-b">Join Collective</base-button>
                    </div>
                </div>
            </section>
            <!-- 1st Hero Variation -->
        </div>  
</template>

<script>
import Modal from "@/components/Modal";
import CollectiveService from "@/services/CollectiveService";
import UserService from "@/services/UserService";
export default {
  name: "landing",
  components: {
    Modal
  },
  data () {
    return {
        modals: {
            modal0: false
        },
        notes: '',
        title: '',
        summary: '',
    };
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    user () {
      console.log("test", this.user)
      if (this.user && this.user != '' && this.user.collective != undefined){
        this.$router.push({ name: "collective" });
      }
    }
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
      },
      async newCollective () {
          let res = await CollectiveService.addCollective({
              notes: this.notes,
              summary: this.summary,
              title: this.title
          });
          console.log('added', this.user)
          let id = res.data.message
          UserService.modifyUser({
              email: this.user.email,
              collective: id
          })
          this.modals.modal0 = false
          this.$router.push({ name: "collective" });
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
    .landing-buttons {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    .landing-b {
        width: 50%;
        margin-right: 0 !important;
        margin-bottom: 0.5rem;
        margin-top: 2.5rem;
    }
    h1 {
        color: #e9ecef;
        margin-right: 0 !important; 
        font-weight: 200;
        text-transform: lowercase;
        letter-spacing: 3px;
    }
</style>
