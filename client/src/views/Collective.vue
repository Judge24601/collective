<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-1 main">
        <div class="shape shape-style-1 bg-gradient-default"></div>
          <div class="container">
              <div class="card-cont"> 
                <card class="border-0" hover shadow body-classes="py-3">
                  <h3 class="text-primary text-uppercase">Poll</h3>
                  <div class="card-inner-poll">
                    <div v-if="!voted" class="vote-options-container">
                      <div v-for="(option, index) in pollOptions" :key="index" class="vote-option">
                        <base-radio :name="index" class="mb-3" v-model="radioSelected">
                          {{option.value}}
                        </base-radio>
                      </div>
                      <div class="vote-buttons-container">
                        <div class="vote-button">
                          <base-button type="success" @click="vote">Vote</base-button>
                        </div>
                        <div class="add-option-button">
                          <base-button type="primary" @click="modals.modal1=true">Add poll option</base-button>
                        </div>
                      </div>
                    </div>
                    <div v-if="voted" class="pie-chart-container">
                      <h1>other test</h1>
                    </div>
                  </div>
                </card>
              </div>

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
import CollectiveService from "@/services/CollectiveService";
import { getInstance } from "@/auth/index";
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
        modal0: false,
        modal1: false
      },
      new_title: "",
      new_poll_option: "",
      new_description: "",
      voted: false,
      pollOptions: [],
      radioSelected: -1
    };
  },
  mounted() {
    this.getPosts();
    this.getPollOptions();
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
    async vote() {
      if (this.radioSelected >= 0) {
        await CollectiveService.postVote("5e1aa961c9b1c6285c451bf8", this.radioSelected);
      }
    },
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
    async getPollOptions() {
      const response = await CollectiveService.fetchCollective("5e1aa961c9b1c6285c451bf8");
      this.pollOptions = response.data.pollChoices;
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
      this.modals.modal0 = false
      this.getPosts()
    },
    async addPollOption() {
      if (this.new_poll_option == "") {
        return;
      }

      await CollectiveService.postNewPollOption("5e1aa961c9b1c6285c451bf8", this.new_poll_option);
      this.modals.modal1 = false;
      this.getPollOptions();
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
    .vote-option {
      justify-content: left;
      text-align: left;
    }
    .vote-buttons-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .vote-button {
      justify-content: left;
      text-align: left;
    }
    .add-option-button {
      justify-content: right;
      text-align: right;
    }

</style>
