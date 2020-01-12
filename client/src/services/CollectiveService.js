import Api from "@/services/Api";

export default {
  addCollective(params) {
    return Api().post("collectives", params);
  },
  fetchCollectives() {
    console.log("got here")
    return Api().get("collectives");
  },
  fetchCollective(collectiveId) {
    return Api().get("collectives/" + collectiveId);
  },
  postNewPollOption(collectiveId, pollOption) {
    return Api().post("collectives/" + collectiveId, {
        pollOption: pollOption
    })
  },
  postVote(collectiveId, choice) {
    return Api().post("collectives/" + collectiveId + "/vote", {
        choice: choice
    })
  }
};
