import Api from "@/services/Api";

export default {
  fetchPosts(params) {
    return Api().get("posts/" + params.collective);
  },
  addPost(params) {
    return Api().post("posts", params);
  },
  updatePost(params) {
    return Api().put("posts/" + params.id, params);
  },
  getPost(params) {
    return Api().get("post/" + params.id);
  },
  deletePost(id) {
    return Api().delete("posts/" + id);
  }
};
