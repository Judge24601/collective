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
  updateUserVote(email, voted) {
    return Api().put("user/" + email + "/voted", {
      voted: voted
    })
  }
};
