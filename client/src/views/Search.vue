<template>
  <div class="position-relative">
    <div class="container">
      <div class="row">
        <div class="input-group mb-4 search">
          <input
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
          v-for="(collective, index) in collectives"
          :key="index"
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
      </div>
    </div>
  </div>
</template>

<script>
import CollectiveService from "@/services/CollectiveService";
export default {
  name: "search",
  components: {},
  data() {
    return {
      collectives: []
    };
  },
  mounted() {
    this.getCollectives();
  },
  methods: {
    async getCollectives() {
      const response = await CollectiveService.fetchCollectives();
      this.collectives = response.data.collectives;
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
