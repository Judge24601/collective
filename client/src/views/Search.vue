<template>
  <div class="position-relative">
    <div class="container">
      <div class="row">
        <div class="input-group mb-4 search">
          <input
            v-model="search"
            type="text"
            placeholder="Search by keyword"
            class="form-control form-control-alternative "
          />
          <div class="input-group-append">
            <span class="input-group-text"
              ><i class="ni ni-zoom-split-in"></i
            ></span>
          </div>
        </div>
      </div>
      <div class="row">
        <h2 class="white-color">Popular Collectives</h2>
      </div>
      <div class="row">
        <div
          v-for="(collective, index) in filteredCollectives"
          :key="index"
          @click="getModal(collective)"
          class=" card-cont col-md-4"
        >
          <card class="border-0" hover shadow body-classes="py-3">
            <h3 class="text-primary text-uppercase">
              {{ collective.title }}
            </h3>
            <div class="card-inner">
              <P class="description mt-1">{{ collective.notes }}</P>
            </div>
          </card>
        </div>
        <modal :show.sync="modals.modal0.show">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ modals.modal0.title }}
          </h5>
          <P class="description mt-1">{{ modals.modal0.notes }}</P>
          <P class="description mt-1">{{ modals.modal0.summary }}</P>
          <base-button type="primary" @click="joinCollective">
            Join this Collective
          </base-button>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import CollectiveService from "@/services/CollectiveService";
import UserService from "@/services/UserService";
import Modal from "@/components/Modal";
import BaseButton from "@/components/BaseButton";
export default {
  name: "search",
  components: {
    Modal,
    BaseButton
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    filteredCollectives () {
      if (this.search.length > 2) {
        let title = this.collectives.filter(x => x.title.includes(this.search))
        let notes = this.collectives.filter(x => x.notes.includes(this.search))
        return [...new Set([...title, ...notes])];
      }
      return this.collectives
    }
  },
  data() {
    return {
      search: '',
      collectives: [],
      modals: {
        modal0: {
          show: false,
          id: "",
          title: "",
          notes: "",
          summary: ""
        }
      }
    };
  },
  mounted() {
    this.getCollectives();
  },
  methods: {
    async getCollectives() {
      const response = await CollectiveService.fetchCollectives();
      this.collectives = response.data.collectives;
    },
    getModal(collective) {
      console.log(collective);
      this.modals.modal0.show = true;
      this.modals.modal0.id = collective._id;
      this.modals.modal0.title = collective.title;
      this.modals.modal0.notes = collective.notes;
      this.modals.modal0.summary = collective.summary;
    },
    async joinCollective() {
      console.log(this.modals.modal0, 'modal')
      await UserService.modifyUser({
        email: this.user.email,
        collective: this.modals.modal0.id
      });
      let user = { ...this.user, collective: this.modals.modal0.id };
      this.$store.commit("updateUser", user);
      this.modals.modal0.show= false;
      this.$router.push({ name: "collective"});
    }
  }
};
</script>

<style>
.search {
  margin-top: 7%;
}
.container {
  height: 100%;
}
.white-color {
  color: #fff;
}
</style>
