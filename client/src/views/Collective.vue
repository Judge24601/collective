<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-1 main">
        <div class="shape shape-style-1 bg-gradient-default"></div>
          <div class="container">
              <div class="new-post">
                  <base-button type="success" size="lg" iconOnly rounded class="newPost" icon="fa fa-plus" @click="modals.modal0 = true">
                  </base-button>
                  <modal :show.sync="modals.modal0">
                      <template slot="header">
                          <h5 class="modal-title" id="exampleModalLabel">New Post</h5>
                      </template>
                      <form>
                          <base-input alternative v-model="new_title" placeholder="Title"></base-input>
                          <textarea v-model="new_description" class="form-control form-control-alternative" rows="3" placeholder="Content"></textarea>
                      </form>
                      <template slot="footer">
                          <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
                          <base-button type="primary" @click="addPost">Save</base-button>
                      </template>
                  </modal>

              </div>
              <div v-for="(post, index) in posts" :key="index" class="card-cont">
                  <card class="border-0" hover shadow body-classes="py-3">
                      
                      <div class="card-inner">
                          <div class="voting">
                              <i :id="'votingG'+ index" class="fa fa-thumbs-up" aria-hidden="true" @click="reactToPost(index, 'good')"></i>
                              <i :id="'votingB'+ index" class="fa fa-thumbs-down" aria-hidden="true" @click="reactToPost(index, 'bad')"></i>
                          </div>
                          <div class="content">
                              <h3 class="text-primary text-uppercase">{{ post.title }}</h3>
                              <P class="description mt-1">{{ post.description }}</p>
                              <tabs v-model="temp" :fill="false" circle>
                                  <tab-pane title="Hide">
                                          <span slot="title" class="nav-link-icon d-block"><i class="ni ni-fat-delete"></i></span>
                                  </tab-pane>
                                  <tab-pane title="Replies" @click="showReplies(post)">
                                          <span slot="title" class="nav-link-icon d-block"><i class="ni ni-chat-round"></i></span>
                                  </tab-pane>
                                  <tab-pane title="Share">
                                      <span slot="title" class="nav-link-icon d-block"><i class="fa fa-share-alt" aria-hidden="true"></i></span>
                                  </tab-pane>
                              </tabs>
                          </div>
                      </div>
                  </card>
              </div>
          </div>
      </section>
      <!-- 1st Hero Variation -->
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs/Tabs";
import TabPane from "@/components/Tabs/TabPane";
import Modal from "@/components/Modal";
import PostsService from "@/services/PostsService";
export default {
  name: "collective",
  components: {
    Tabs,
    TabPane,
    Modal,
  },
  data() {
    return {
      posts: [],
      postReplies: {},
      temp: '',
      modals: {
        modal0: false
      },
      new_title: "",
      new_description: ""
    };
  },
  mounted() {
    this.getPosts();
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    user() {
      console.log("test", this.user);
      if (this.user && this.user.collective == undefined) {
        this.$router.push({ name: "landing" });
      }
      this.getPosts()
    }
  },
  methods: {
    async getPosts() {
      const response = await PostsService.fetchPosts(this.user);
      this.posts = response.data.posts;
    },
    async showReplies (index) {
      //temporary
      console.log('show')
      const response = await PostsService.fetchPosts(this.user);
      this.postReplies = {...this.postReplies , index: response.data.posts}
    },
    hideReplies (index) {
      this.postReplies = {...this.postReplies , index: []}
    },

    reactToPost(id, react) {
      let good = document.getElementById('votingG' + id)
      let bad = document.getElementById('votingB' + id)
      if (react === 'good'){
        good.classList.add('good');
        if (bad.classList.contains('bad')) {
          bad.classList.remove('bad')
        }
      }else {
        bad.classList.add('bad');
        if (good.classList.contains('good')) {
          good.classList.remove('good')
        }
      }
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.getPosts();
    },
    async addPost() {
      await PostsService.addPost({
        title: this.new_title,
        description: this.new_description,
        collectiveId: this.user.collective
      });
      this.modals.modal0 = false;
      this.getPosts();
    }
  }
};
</script>
<style>
    .newPost {
        margin-top: -1rem;
        margin-bottom: 1rem;
    }
    .new-post {
      position: fixed;
      right: 7.5%;
      bottom: 10%;
      z-index: 3;
    }
    .main {
      margin-top: 3.5rem !important;
      margin-bottom: 2rem !important;
    }
</style>
