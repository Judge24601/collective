<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-1 main">
        <div class="shape shape-style-1 bg-gradient-default"></div>
          <div class="container new">
            <base-alert type="success" dismissible>
            <span class="alert-inner--icon"><i class="ni ni-like-2"></i></span>
            <span class="alert-inner--text">
              <strong>{{ collective.title }} has raised {{collective.totalAmount}} dollars this month! Keep it up!</strong> </span>
              <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
               <span aria-hidden="true">&times;</span>
              </button>
            </base-alert>
          <div>
              <div class="card-cont"> 
                <card class="border-0" hover shadow body-classes="py-3">
                  <h3 class="text-primary text-uppercase">Poll</h3>
                  <div class="card-inner-poll">
                    <div v-if="!voted" class="vote-options-container">
                      <div v-for="(option, index) in chartOptions.labels" :key="index" class="vote-option">
                        <base-radio :name="index" class="mb-3" v-model="radioSelected">
                          {{option}}
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
                      <apexchart ref="votesChart" type="pie" width="600" :options="chartOptions" :series="pollVotes"></apexchart>
                      <!-- <base-button type="success" @click="tempTest">Temp test</base-button> -->
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
                  <modal :show.sync="modals.modal1">
                    <template slot="header">
                      <h5 class="modal-title" id="exampleModalLabel">Create New Poll Option</h5>
                    </template>
                    <form>
                      <base-input alternative v-model="new_poll_option" placeholder="Enter option here"></base-input>
                    </form>
                    <template slot="footer">
                        <base-button type="secondary" @click="modals.modal1 = false">Close</base-button>
                        <base-button type="primary" @click="addPollOption">Create</base-button>
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
import UserService from "@/services/UserService";
import VueApexCharts from 'vue-apexcharts';
import Pusher from 'pusher-js';
//import { getInstance } from "@/auth/index";

var pusher;

export default {
  name: "collective",
  components: {
    Tabs,
    TabPane,
    Modal,
    apexchart: VueApexCharts,
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
      pollVotes: [],
      radioSelected: -1,
      socketId: '',


      series: [44, 55, 13, 43, 22],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        //labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      collective: ''
    };
  },
  created() {
    console.log(process.env.VUE_APP_KEY);
    console.log(process.env.VUE_APP_CLUSTER);
    pusher = new Pusher(process.env.VUE_APP_KEY, { cluster: process.env.VUE_APP_CLUSTER });
    this.userSetup();
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
      if (this.user != '' && this.user != undefined) {
        if(this.user.collective == undefined) {
          this.$router.push({ name: "landing" });
        }
        this.getPosts()
      }
      if (this.user == '') {
        this.$router.push({ name: "landing" });
      }
    }
  },
  methods: {
    async vote() {
      if (this.radioSelected >= 0) {
        await CollectiveService.postVote(this.user.collective, this.radioSelected, this.socketId);
        await UserService.updateUserVote(this.user.email, true);
        let user = {...this.user, voted: true};
        this.$store.commit('updateUser', user);
        this.voted = true;
      }
    },
    async userSetup() {
      await this.$auth.handleRedirectCallback();
      let email = this.$auth.user.email
      let user = await UserService.getUser(email)
      this.$store.commit('updateUser', user.data)
      
      /*pusher.connection.bind('connected', data => {
        this.socketId = pusher.connection.socket_id;
      });*/
      console.log("setting up", this.user)
      pusher.subscribe(this.user.collective);
      pusher.bind('vote', data => {
          //var co = data.pollId;
          var choice = data.choice;
          console.log('sub sent vals');
          this.pollVotes[choice]++;
          this.$refs.votesChart.updateSeries(this.pollVotes);
          /*voteCount = document.querySelector('#vote-count-' + pollId + '-' + choice);
          voteCount.textContent++;
          // we'll flash the colour for a moment
          var color = voteCount.style.color;
          setTimeout(function () {
              voteCount.style.color = color;
          }, 2000);
          voteCount.style.color = 'green';*/
      });
      this.getPollOptions();
      this.getCollective();
    },
    async tempTest() {
      this.pollVotes[0]++;
      this.$refs.votesChart.updateSeries(this.pollVotes);
    },
    async getPosts() {
      if (!this.user || !this.user.collective) {
        return
      }
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
      const response = await CollectiveService.fetchCollective(this.user.collective);
      if (response.data.pollChoices != null && response.data.pollChoices.length > 0) {
        this.chartOptions.labels = response.data.pollChoices.map(ans => ans.value);
        this.pollVotes = response.data.pollChoices.map(ans => ans.votes);
      }

      this.voted = this.user.voted;
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

      await CollectiveService.postNewPollOption(this.user.collective, this.new_poll_option);
      this.modals.modal1 = false;
      this.getPollOptions();
    },
    async getCollective() {
      console.log('hello')
      const response = await CollectiveService.fetchCollective(
        this.user.collective
      );
      this.collective = response.data;
      console.log('res', response.data);
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
    .pie-chart-container {
      min-height: 10rem;
      display:flex;
      justify-content: center;
      text-align: left;
    }
  .new {
  padding-top: 0% !important;
  } 

</style>
