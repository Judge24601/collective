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
        <base-dropdown>
          <base-button slot="title" type="secondary" class="dropdown-toggle">
            Filter by type of organization
          </base-button>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </base-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import BaseDropdown from "@/components/BaseDropdown";
import BaseButton from "@/components/BaseButton";
export default {
  name: "search",
  components: {
    BaseDropdown,
    BaseButton
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
</style>
