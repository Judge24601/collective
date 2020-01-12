<template>
    <div>
        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-1">
                <div class="shape shape-style-0 shape-default shape-skew">
                </div>
                <div class="container shape-container mt--200">
                    <div>
                        <base-button type="success" @click="modals.modal0 = true">
                            New Post
                        </base-button>
                        <modal :show.sync="modals.modal0">
                            <template slot="header">
                                <h5 class="modal-title" id="exampleModalLabel">New Post</h5>
                            </template>
                            <form>
                                <base-input alternative v-model="new_title"></base-input>
                                <textarea  v-model="new_description" alternative rows="3" placeholder="Write a large text here ..."></textarea>
                            </form>
                            <template slot="footer">
                                <base-button type="secondary" @click="modals.modal0 = false">Close</base-button>
                                <base-button type="primary" @click="addPost">Save</base-button>
                            </template>
                        </modal>

                    </div>
                    <div v-for="(post, index) in posts" :key="index" class="card-cont">
                        <card class="border-0" hover shadow body-classes="py-5">
                            <h4 class="text-primary text-uppercase">{{ post.title }}</h4>
                            <p class="description mt-3">{{ post.description }}</p>
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
  name: "home",
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
  methods: {
    async getPosts() {
      const response = await PostsService.fetchPosts();
      this.posts = response.data.posts;
    },
    async deletePost(id) {
      await PostsService.deletePost(id);
      this.$router.push({ name: "landing" });
    },
    async addPost() {
      await PostsService.addPost({
        title: this.new_title,
        description: this.new_description
      });
      this.modals.modal0 = false
      this.getPosts()
    }
  }
};
</script>
