<template>
    <div>
        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-1 main">
                <div class="shape shape-style-1 bg-gradient-default">
                </div>
                <div class="container">
                    <div>
                        <base-button type="success"  class="newPost" @click="modals.modal0 = true">
                            New Post
                        </base-button>
                        <modal :show.sync="modals.modal0">
                            <template slot="header">
                                <h5 class="modal-title" id="exampleModalLabel">New Post</h5>
                            </template>
                            <form>
                                <base-input alternative v-model="new_title"></base-input>
                                <textarea v-model="new_description" class="form-control form-control-alternative" rows="3" placeholder="Write a large text here ..."></textarea>
                            </form>
                            <template slot="footer">
                                <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
                                <base-button type="primary" @click="addPost">Save</base-button>
                            </template>
                        </modal>

                    </div>
                    <div v-for="(post, index) in posts" :key="index" class="card-cont">
                        <card class="border-0" hover shadow body-classes="py-3">
                            <h3 class="text-primary text-uppercase">{{ post.title }}</h3>
                            <div class="card-inner">
                                <div class="voting">
                                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                    <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                                </div>
                                <div class="content">
                                    
                                    <P class="description mt-1">{{ post.description }}</p>
                                    <tabs :fill="false" circle>
                                        <tab-pane title="Hide">
                                                <span slot="title" class="nav-link-icon d-block"><i class="ni ni-fat-delete"></i></span>
                                        </tab-pane>
                                        <tab-pane title="Replies">
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
    Modal
  },
  data() {
    return {
      posts: [],
      modals: {
        modal0: false,
      },
      new_title: "",
      new_description: "",
    };
  },
  mounted() {
    this.getPosts();
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    user () {
      console.log("test", this.user)
      if (this.user && this.user != '' && this.user.collective == undefined){
        this.$router.push({ name: "landing" });
      }
    }
  },
  methods: {
    async getPosts() {
      const response = await PostsService.fetchPosts(this.user);
      this.posts = response.data.posts;
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.getPosts()
    },
    async addPost() {
      await PostsService.addPost({
        title: this.new_title,
        description: this.new_description,
        collectiveId: this.user.collective
      });
      this.modals.modal0 = false
      this.getPosts()
    }
  }
};
</script>
<style>
    .newPost {
        margin-top: -1rem;
        margin-bottom: 1rem;
    }
    .main {
      margin-top: 3.5rem !important;
      margin-bottom: 2rem !important;
    }
</style>
