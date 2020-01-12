import Api from "@/services/Api";

export default {
  addUser(params) {
    return Api().post("users", params);
  },
  getUser(params) {
    return Api().get("user/" + params);
  },
  modifyUser(params) {
    return Api().put("user/" + params.email, params);
  },
  updateUserVote(email, voted, socketId) {
    return Api().put("user/" + email + "/voted", {
      voted: voted,
      socketId: socketId
    })
  }
};
